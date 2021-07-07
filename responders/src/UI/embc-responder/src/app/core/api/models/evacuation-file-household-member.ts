/* tslint:disable */
/* eslint-disable */
import { HouseholdMemberType } from './household-member-type';
export interface EvacuationFileHouseholdMember {
  dateOfBirth?: null | string;
  firstName?: null | string;
  gender?: null | string;
  id?: null | string;
  initials?: null | string;
  isHouseholdMember?: boolean;
  isMatch?: boolean;
  isPrimaryRegistrant?: boolean;
  lastName?: null | string;
  type?: HouseholdMemberType;
}
