import { Injectable } from '@nestjs/common';
import { XMLParser } from 'fast-xml-parser';
import { createObjectCsvWriter } from 'csv-writer';
import * as fs from 'fs';
import * as path from 'path';
import * as stream from 'stream';
import * as util from 'util';
import {
  IConvertService,
  OrgUnitDetails,
  OrgUnit,
  Person,
  ContactValue,
  Record,
} from '../convert.interface';

const pipeline = util.promisify(stream.pipeline);

function normalizeText(text: string): string {
  return text
    ? text
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .toLowerCase()
    : '';
}

@Injectable()
export class XmlToCsvService implements IConvertService {
  async convert(): Promise<void> {
    const xmlFilePath = path.join(process.cwd(), 'public', 'data.xml');
    const csvFilePath = path.join(process.cwd(), 'public', 'persons.csv');

    const xmlStream = fs.createReadStream(xmlFilePath, 'utf-8');
    let xmlData = '';

    await pipeline(
      xmlStream,
      new stream.Writable({
        write(chunk, encoding, callback) {
          xmlData += chunk.toString();
          callback();
        },
      }),
    );

    const parser = new XMLParser({ ignoreAttributes: false });
    const jsonObj = parser.parse(xmlData);

    const eosXmlStructure = jsonObj['ns2:eos-xml-structure'];
    const persons = eosXmlStructure.persons.person;
    const orgUnits = eosXmlStructure['org-units']['org-unit'];

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
        { id: 'iosFunkce', title: 'iosFunkce' },
        { id: 'iosBudova', title: 'iosBudova' },
        { id: 'iosKancelar', title: 'iosKancelar' },
        { id: 'iosReferat', title: 'iosReferat' },
        { id: 'iosOddeleni', title: 'iosOddeleni' },
        { id: 'iosOdbor', title: 'iosOdbor' },
        { id: 'iosVybor', title: 'iosVybor' },
        { id: 'iosJine', title: 'iosJine' },
        { id: 'iosKancelarJednotka', title: 'iosKancelarJednotka' },
        //{ id: 'iosPracoviste', title: 'iosPracoviste' },
        { id: 'iosNadrizena_jednotka', title: 'iosNadrizena_jednotka' },
      ],
    });

    const getContactValue = (
      contactValues: ContactValue[],
      id: string | number,
    ): string | undefined => {
      const contact = contactValues.find((cv) => {
        const identifier = cv['contact-type-identifier'];
        return (
          String(Array.isArray(identifier) ? identifier[0] : identifier) ===
          String(id)
        );
      });
      if (!contact) return undefined;
      const content = contact.content;
      return typeof content === 'string'
        ? content.replace(/^\|+|\|+$/g, '')
        : content;
    };

    const orgUnitMap = new Map<string, string>();
    for (const unit of orgUnits as OrgUnit[]) {
      if (unit.identifier && unit.name) {
        orgUnitMap.set(unit.identifier, unit.name);
      }
    }

    const getOrgUnitDetails = (personIdentifier: string): OrgUnitDetails => {
      for (const unit of orgUnits as OrgUnit[]) {
        const orgRoles = unit['org-roles']?.['org-role'];
        if (!orgRoles) continue;
        const rolesArray = Array.isArray(orgRoles) ? orgRoles : [orgRoles];
        for (const role of rolesArray) {
          const assignments =
            role['person-assignments']?.['person-role-assignment'];
          if (!assignments) continue;
          const assignmentsArray = Array.isArray(assignments)
            ? assignments
            : [assignments];
          for (const assignment of assignmentsArray) {
            if (assignment['person-identifier'] === personIdentifier) {
              return {
                iosPozice: unit.name,
                iosIdentifier: unit.identifier,
                iosSuperIdentifier: unit['parent-identifier'],
                iosFunkce: role.name,
              };
            }
          }
        }
      }
      return {
        iosPozice: undefined,
        iosIdentifier: undefined,
        iosSuperIdentifier: undefined,
        iosFunkce: undefined,
      };
    };

    const records: Record[] = (persons as Person[])
      .filter((person) => {
        const isDisabled = String(person.disabled) === 'false';
        const { iosPozice, iosFunkce } = getOrgUnitDetails(person.identifier);
        const hasValidRole =
          iosFunkce !== 'referent - dohoda' &&
          iosFunkce !== 'referent/ka - dohoda' &&
          iosFunkce !== 'Neuvolnění zastupitelé';
        return isDisabled && hasValidRole;
      })
      .map((person) => {
        const contactValues: ContactValue[] = (() => {
          const cv = person['contact-values'] || {};
          if (Array.isArray(cv['contact-value'])) return cv['contact-value'];
          if (cv['contact-value']) return [cv['contact-value']];
          return [];
        })();

        const iosLinka1 = getContactValue(contactValues, '202');
        const iosMobil = getContactValue(contactValues, '602');
        const { iosPozice, iosIdentifier, iosSuperIdentifier, iosFunkce } =
          getOrgUnitDetails(person.identifier);

        const identifierName = orgUnitMap.get(iosIdentifier ?? '');
        let iosReferat,
          iosOddeleni,
          iosOdbor,
          iosJine,
          iosKancelarJednotka,
          iosVybor,
          iosNadrizena_jednotka;

        const normPozice = normalizeText(iosPozice ?? '');
        const normFunkce = normalizeText(iosFunkce ?? '');

        if (normFunkce.includes('vedouci referatu')) iosReferat = iosPozice;
        if (normFunkce.includes('vedouci oddeleni')) iosOddeleni = iosPozice;
        if (normFunkce.includes('vedouci odboru')) iosOdbor = iosPozice;

        if (normPozice.startsWith('referat') && !iosReferat)
          iosReferat = iosPozice;
        if (normPozice.startsWith('oddeleni') && !iosOddeleni)
          iosOddeleni = iosPozice;
        if (normPozice.startsWith('odbor') && !iosOdbor) iosOdbor = iosPozice;
        if (normPozice.startsWith('kancelar') && !iosKancelarJednotka)
          iosKancelarJednotka = iosPozice;
        if (normPozice.startsWith('vybor') && !iosVybor) iosVybor = iosPozice;
        if (
          (normPozice.startsWith('uvolneny') ||
            normPozice.startsWith('uvolnena')) &&
          !normPozice.includes('rmc')
        ) {
          iosVybor = iosPozice;
        } else {
          let upravenyPozice = iosPozice;
          if (upravenyPozice?.includes('_')) {
            upravenyPozice = upravenyPozice.split('_')[0];
          }
          if (upravenyPozice?.includes('RMČ')) {
            upravenyPozice = upravenyPozice.replace('RMČ', 'ZMČ');
          }
          if (
            !normPozice.startsWith('referat') &&
            !normPozice.startsWith('oddeleni') &&
            !normPozice.startsWith('odbor') &&
            !normPozice.startsWith('kancelar') &&
            !normPozice.startsWith('vybor')
          ) {
            iosJine = upravenyPozice;
          }
        }

        let currentIdentifier = iosSuperIdentifier;
        while (currentIdentifier) {
          const unitName = orgUnitMap.get(currentIdentifier);
          const normUnit = normalizeText(unitName ?? '');

          if (normUnit.includes('oddeleni') && !iosOddeleni)
            iosOddeleni = unitName;
          else if (normUnit.includes('odbor') && !iosOdbor) iosOdbor = unitName;
          else if (normUnit.includes('kancelar') && !iosKancelarJednotka)
            iosKancelarJednotka = unitName;
          else if (
            normUnit.startsWith('tajemnik') ||
            normUnit.startsWith('starosta')
          ) {
            iosNadrizena_jednotka = unitName;
            break;
          }

          const nextUnit = (orgUnits as OrgUnit[]).find(
            (u) => u.identifier === currentIdentifier,
          );
          currentIdentifier = nextUnit?.['parent-identifier'];
        }

        let iosPracoviste = identifierName;

        return {
          iosOsc: person['personal-number'],
          iosTitul_pred: person['degree-before'],
          iosPrijmeni: person.surname1,
          iosJmeno: person.firstname1,
          iosTitul_za: person['degree-after'],
          iosLinka1: iosLinka1 ? `267093${iosLinka1}` : undefined,
          iosEmail: person.email,
          iosMobil: iosMobil,
          iosFunkce: iosFunkce,
          iosBudova: person.location?.building,
          iosKancelar: person.location?.room,
          iosReferat,
          iosOddeleni,
          iosOdbor,
          iosVybor,
          iosJine,
          iosKancelarJednotka,
          //iosPracoviste,
          iosNadrizena_jednotka,
        };
      });

    await csvWriter.writeRecords(records);
    console.log(`CSV file has been created at ${csvFilePath}`);
  }
}
