import { PersonDetails } from '../api/models';

export interface HouseholdMemberModel extends PersonDetails {
  sameLastName: boolean;
}
