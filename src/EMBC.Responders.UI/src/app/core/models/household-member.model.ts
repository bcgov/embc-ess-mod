import { EvacuationFileHouseholdMember } from '../api/models';

export interface HouseholdMemberModel extends EvacuationFileHouseholdMember {
  sameLastName: boolean;
  householdMemberFromDatabase: boolean;
}
