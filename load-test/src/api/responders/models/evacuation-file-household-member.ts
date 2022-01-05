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
  isPrimaryRegistrant?: boolean;
  isRestricted?: null | boolean;
  isUnder19?: boolean;
  isVerified?: null | boolean;
  lastName?: null | string;
  linkedRegistrantId?: null | string;
  type?: HouseholdMemberType;
}
