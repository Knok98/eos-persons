import { Injectable } from '@nestjs/common';
import { XMLParser } from 'fast-xml-parser';
import { createObjectCsvWriter } from 'csv-writer';
import * as fs from 'fs';
import * as path from 'path';
import * as stream from 'stream';
import * as util from 'util';
import { IConvertService, OrgUnitDetails, OrgUnit, Person, ContactValue, Record } from '../convert.interface';

const pipeline = util.promisify(stream.pipeline);

@Injectable()
export class XmlToCsvService implements IConvertService {
  async convert(): Promise<void> {
    const xmlFilePath = path.join(process.cwd(), 'public', 'data.xml');
    const csvFilePath = path.join(process.cwd(), 'public', 'persons.csv');

    console.log(`Reading XML file from: ${xmlFilePath}`);
    const xmlStream = fs.createReadStream(xmlFilePath, 'utf-8');
    let xmlData = '';

    await pipeline(
      xmlStream,
      new stream.Writable({
        write(chunk, encoding, callback) {
          xmlData += chunk.toString();
          callback();
        }
      })
    );

    const parser = new XMLParser({ ignoreAttributes: false });
    const jsonObj = parser.parse(xmlData);

    console.log('XML file parsed successfully.');

    const eosXmlStructure = jsonObj['ns2:eos-xml-structure'];
    const persons = eosXmlStructure.persons.person;
    const orgUnits = eosXmlStructure['org-units']['org-unit'];

    console.log(`Found ${persons.length} persons in the XML.`);

    const csvWriter = createObjectCsvWriter({
      path: csvFilePath,
      header: [
        { id: 'iosOsc', title: 'iosOsc' },
        { id: 'iosTitul_pred', title: 'iosTitul_pred' },
        { id: 'iosPrijmeni', title: 'iosPrijmeni' },
        { id: 'iosJmeno', title: 'iosJmeno' },
        { id: 'iosTitul_za', title: 'iosTitul_za' },
        { id: 'iosLinka1', title: 'iosLinka1' },
        { id: 'iosEmail', title: 'iosEmail' },
        { id: 'iosMobil', title: 'iosMobil' },
        { id: 'iosPozice', title: 'iosPozice' },
        { id: 'iosFunkce', title: 'iosFunkce' },
        { id: 'iosBudova', title: 'iosBudova' },
        { id: 'iosKancelar', title: 'iosKancelar' },
      ],
    });

    

    const getContactValue = (contactValues: ContactValue[], id: string | number): string | undefined => {
      const contact = contactValues.find(cv => {
      const identifier = cv['contact-type-identifier'];
      return String(Array.isArray(identifier) ? identifier[0] : identifier) === String(id);
      });
      if (!contact) return undefined;
      const content = contact.content;
      return typeof content === 'string' ? content.replace(/^\|+|\|+$/g, '') : content;
    };

    const orgUnitCache = new Map();

    

    

    const getOrgUnitDetails = (personIdentifier: string): OrgUnitDetails => {
      if (orgUnitCache.has(personIdentifier)) {
      return orgUnitCache.get(personIdentifier) as OrgUnitDetails;
      }
      for (const unit of orgUnits as OrgUnit[]) {
      const orgRoles = unit['org-roles'] && unit['org-roles']['org-role'];
      if (!orgRoles) continue;
      const rolesArray = Array.isArray(orgRoles) ? orgRoles : [orgRoles];
      for (const role of rolesArray) {
        const assignments = role['person-assignments'] && role['person-assignments']['person-role-assignment'];
        if (!assignments) continue;
        const assignmentsArray = Array.isArray(assignments) ? assignments : [assignments];
        for (const assignment of assignmentsArray) {
        if (assignment['person-identifier'] === personIdentifier) {
          const details: OrgUnitDetails = { 
            iosPozice: unit.name, 
            iosFunkce: role.name,
            iosIdentifier: unit.identifier,
            iosSuperIdentifier: unit['parent-identifier']
          };
          orgUnitCache.set(personIdentifier, details);
          return details;
        }
        }
      }
      }
      return { iosPozice: undefined, iosFunkce: undefined, iosIdentifier: undefined, iosSuperIdentifier: undefined };
    };

    

    const records: Record[] = (persons as Person[])
      .filter(person => {
      const isDisabled = String(person.disabled) === 'false';
      const { iosPozice, iosFunkce } = getOrgUnitDetails(person.identifier);
      const hasValidRole = iosFunkce !== 'referent - dohoda' && iosFunkce !== 'referent/ka - dohoda' && iosFunkce !== 'Neuvolnění zastupitelé';
      return isDisabled && hasValidRole;
      })
      .map(person => {
      const contactValues: ContactValue[] = (() => {
        const cv = person['contact-values'] || {};
        if (Array.isArray(cv['contact-value'])) {
        return cv['contact-value'];
        } else if (cv['contact-value']) {
        return [cv['contact-value']];
        }
        return [];
      })();

      const iosLinka1 = getContactValue(contactValues, '202');
      const iosMobil = getContactValue(contactValues, '602');
      const { iosPozice, iosFunkce } = getOrgUnitDetails(person.identifier);

      const row: Record = {
        iosOsc: person['personal-number'],
        iosTitul_pred: person['degree-before'],
        iosPrijmeni: person.surname1,
        iosJmeno: person.firstname1,
        iosTitul_za: person['degree-after'],
        iosLinka1: iosLinka1 ? `267093${iosLinka1}` : undefined,
        iosEmail: person.email,
        iosMobil: iosMobil,
        iosPozice: iosPozice,
        iosFunkce: iosFunkce,
        iosBudova: person.location?.building,
        iosKancelar: person.location?.room,
      };

      return row;
      });

    console.log(`Writing ${records.length} records to CSV file.`);

    await csvWriter.writeRecords(records);
    console.log(`CSV file has been created at ${csvFilePath}`);
  }
}
