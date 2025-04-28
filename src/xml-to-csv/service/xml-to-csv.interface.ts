export interface IXmlToCsvService {
    convertXmlToCsv(): Promise<void>;
  }
  


export interface ContactValue {
    'contact-type-identifier': string | string[];
    content: string | undefined;
  }

export interface OrgRole {
    name: string;
    'person-assignments'?: {
    'person-role-assignment': PersonRoleAssignment | PersonRoleAssignment[];
    };
  }

export  interface PersonRoleAssignment {
    'person-identifier': string;
  }

export interface OrgUnitDetails {
    iosPozice: string | undefined;
    iosFunkce: string | undefined;
  }

export interface OrgUnit {
    name: string;
    'org-roles'?: {
    'org-role': OrgRole | OrgRole[];
    };
  }
export  interface Person {
    identifier: string;
    disabled: boolean | string;
    'personal-number': string;
    'degree-before'?: string;
    surname1: string;
    firstname1: string;
    'degree-after'?: string;
    email?: string;
    location?: {
    building?: string;
    room?: string;
    };
    'contact-values'?: {
    'contact-value'?: ContactValue | ContactValue[];
    };
  }

export interface Record {
    iosOsc: string;
    iosTitul_pred?: string;
    iosPrijmeni: string;
    iosJmeno: string;
    iosTitul_za?: string;
    iosLinka1?: string;
    iosEmail?: string;
    iosMobil?: string;
    iosPozice?: string;
    iosFunkce?: string;
    iosBudova?: string;
    iosKancelar?: string;
  }