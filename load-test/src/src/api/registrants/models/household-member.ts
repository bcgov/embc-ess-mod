/* tslint:disable */
/* eslint-disable */
import { PersonDetails } from './person-details';

/**
 * A member of the household in needs assessment
 */
export interface HouseholdMember {
  details?: PersonDetails;
  id?: null | string;
  isMinor?: boolean;
  isPrimaryRegistrant?: boolean;
}
