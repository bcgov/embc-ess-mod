/* tslint:disable */
/* eslint-disable */
import { PersonDetails } from '../models/person-details';
export interface HouseholdMember {
  details?: PersonDetails;
  id?: string | null;
  isMinor?: boolean;
  isPrimaryRegistrant?: boolean;
}
