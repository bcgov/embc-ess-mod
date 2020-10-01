import { ContactDetails, Address, PersonDetails } from './createProfile.model';

export class Registration {
    contactDetails: ContactDetails;
    informationCollectionConsent: boolean;
    mailingAddress: Address;
    personalDetails: PersonDetails;
    primaryAddress: Address;
    restrictedAccess: boolean;

    constructor() {}
  }