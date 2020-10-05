import { ContactDetails, Address, PersonDetails } from './createProfile.model';

export interface Registration {
    contactDetails: ContactDetails;
    informationCollectionConsent: boolean;
    mailingAddress: Address;
    personalDetails: PersonDetails;
    primaryAddress: Address;
    restrictedAccess: boolean;
  }

  export class RegistrationUpdate {

    // contactDetails: ContactDetails;
    // informationCollectionConsent: boolean;
    // mailingAddress: Address;
    // personalDetails: PersonDetails;
    // primaryAddress: Address;
    // restrictedAccess: boolean;

    // constructor(init?: Partial<RegistrationUpdate>) {
    //   Object.assign(this, init);
    // }
    //updateRegistration()
  }