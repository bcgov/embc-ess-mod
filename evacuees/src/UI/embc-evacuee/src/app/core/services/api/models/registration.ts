/* tslint:disable */
import { Address } from './address';
import { ContactDetails } from './contact-details';
import { PersonDetails } from './person-details';

/**
 * New registration form
 */
export interface Registration {
  contactDetails: ContactDetails;
  informationCollectionConsent: boolean;
  mailingAddress: Address;
  personalDetails: PersonDetails;
  primaryAddress: Address;
  restrictedAccess: boolean;
}
