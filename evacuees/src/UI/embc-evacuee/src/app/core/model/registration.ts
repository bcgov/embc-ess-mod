import { RegAddress } from './address';
import { ContactDetails, PersonDetails } from './profile.model';

export interface Registration {
    contactDetails: ContactDetails;
    informationCollectionConsent: boolean;
    mailingAddress: RegAddress;
    personalDetails: PersonDetails;
    primaryAddress: RegAddress;
    restrictedAccess: boolean;
    secretPhrase: string;
  }
