/* tslint:disable */
/* eslint-disable */
import { Address } from '../models/address';
import { ContactDetails } from '../models/contact-details';
import { PersonDetails } from '../models/person-details';
import { SecurityQuestion } from '../models/security-question';
export interface RegistrantProfile {
  authenticatedUser?: boolean;
  contactDetails: ContactDetails;
  createdOn?: string;
  id?: string | null;
  isMailingAddressSameAsPrimaryAddress?: boolean;
  isMinor?: boolean;
  mailingAddress: Address;
  modifiedOn?: string;
  personalDetails: PersonDetails;
  primaryAddress: Address;
  restriction: boolean;
  securityQuestions?: Array<SecurityQuestion> | null;
  verifiedUser?: boolean;
}
