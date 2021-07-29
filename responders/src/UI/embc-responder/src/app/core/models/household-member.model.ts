import { EvacuationFileHouseholdMember } from '../api/models';

export interface HouseholdMemberModel extends EvacuationFileHouseholdMember {
  sameLastName: boolean;
  fromDataBase: boolean;
}
