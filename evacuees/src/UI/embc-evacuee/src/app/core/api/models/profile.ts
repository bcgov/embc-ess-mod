/* tslint:disable */
/* eslint-disable */
import { Address } from './address';
import { ContactDetails } from './contact-details';
import { PersonDetails } from './person-details';

/**
 * Registrant's profile
 */
export interface Profile {
  bceId?: null | string;
  contactDetails: ContactDetails;
  eraId?: null | string;
  mailingAddress?: null | Address;
  personalDetails: PersonDetails;
  primaryAddress: Address;
  restrictedAccess?: null | any;
  secretPhrase?: null | any;
}
