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
  contactDetails: ContactDetails;
  id?: null | string;
  isMailingAddressSameAsPrimaryAddress?: boolean;
  mailingAddress?: null | Address;
  personalDetails: PersonDetails;
  primaryAddress: Address;
  restriction?: boolean;
  securityQuestions?: null | Array<SecurityQuestion>;
  verifiedUser?: boolean;
}
