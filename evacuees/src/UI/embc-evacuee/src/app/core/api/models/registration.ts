/* tslint:disable */
/* eslint-disable */
import { Address } from './address';
import { ContactDetails } from './contact-details';
import { PersonDetails } from './person-details';

/**
 * New registration form
 */
export interface Registration {
  bcServicesCardId?: null | string;
  contactDetails: ContactDetails;
  contactId?: null | string;
  evacuatedFromAddress: Address;
  informationCollectionConsent: boolean;
  mailingAddress?: null | Address;
  personalDetails: PersonDetails;
  primaryAddress: Address;
  restrictedAccess: boolean;
  secretPhrase: string;
}
