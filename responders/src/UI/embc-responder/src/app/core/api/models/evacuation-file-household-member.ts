/* tslint:disable */
/* eslint-disable */
import { HouseholdMemberType } from './household-member-type';
export interface EvacuationFileHouseholdMember {
  dateOfBirth?: null | string;
  firstName?: null | string;
  gender?: null | string;
  initials?: null | string;
  isMatch?: boolean;
  lastName?: null | string;
  type?: HouseholdMemberType;
}
