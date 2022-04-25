/* tslint:disable */
/* eslint-disable */
import { Address } from './address';
import { ContactDetails } from './contact-details';
import { PersonDetails } from './person-details';
import { SecurityQuestion } from './security-question';

/**
 * Registrant profile
 */
export interface RegistrantProfile {
  authenticatedUser?: boolean;
  contactDetails: ContactDetails;
  createdOn?: string;
  id?: null | string;
  isMailingAddressSameAsPrimaryAddress?: boolean;
  isMinor?: boolean;
  mailingAddress: Address;
  modifiedOn?: string;
  personalDetails: PersonDetails;
  primaryAddress: Address;
  restriction: boolean;
  securityQuestions?: Array<SecurityQuestion>;
  verifiedUser?: boolean;
}
