/* eslint-disable */
/* eslint-disable */
import { PersonDetails } from './person-details';

/**
 * A member of the household in needs assessment
 */
export interface HouseholdMember {
  details?: null | PersonDetails;
  id?: null | string;
  isUnder19?: boolean;
}
