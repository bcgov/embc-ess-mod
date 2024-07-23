/* tslint:disable */
/* eslint-disable */
import { ContactDetails } from '../models/contact-details';
import { PersonDetails } from '../models/person-details';
export interface HouseholdMember {
  contactDetails?: ContactDetails;
  details?: PersonDetails;
  id?: string | null;
  isMinor?: boolean;
  isPrimaryRegistrant?: boolean;
}
