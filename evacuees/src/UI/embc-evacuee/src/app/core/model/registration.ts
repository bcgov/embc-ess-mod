import { Address } from './address';
import { ContactDetails, PersonDetails } from './profile.model';

export interface Registration {
    contactDetails: ContactDetails;
    informationCollectionConsent: boolean;
    mailingAddress: Address;
    personalDetails: PersonDetails;
    primaryAddress: Address;
    restrictedAccess: boolean;
    secretPhrase: string;
  }
