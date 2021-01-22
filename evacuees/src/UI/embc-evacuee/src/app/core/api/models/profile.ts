/* tslint:disable */
/* eslint-disable */
import { Address } from './address';
import { ContactDetails } from './contact-details';
import { PersonDetails } from './person-details';

/**
 * Registrant's profile
 */
export interface Profile {
  contactDetails: ContactDetails;
  mailingAddress?: null | Address;
  personalDetails: PersonDetails;
  primaryAddress: Address;
}
