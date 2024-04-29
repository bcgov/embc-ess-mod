/* tslint:disable */
/* eslint-disable */
import { Address } from '../models/address';
import { ContactDetails } from '../models/contact-details';
import { PersonDetails } from '../models/person-details';
import { SecurityQuestion } from '../models/security-question';
export interface Profile {
  contactDetails: ContactDetails;
  id?: string | null;
  isMailingAddressSameAsPrimaryAddress?: boolean;
  mailingAddress?: Address;
  personalDetails: PersonDetails;
  primaryAddress: Address;
  restrictedAccess?: boolean;
  securityQuestions?: Array<SecurityQuestion> | null;
}
