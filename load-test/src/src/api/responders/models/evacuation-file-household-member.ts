/* tslint:disable */
/* eslint-disable */
import { HouseholdMemberType } from './household-member-type';
export interface EvacuationFileHouseholdMember {
  dateOfBirth?: string;
  firstName?: string;
  gender?: string;
  id?: null | string;
  initials?: null | string;
  isHouseholdMember?: boolean;
  isMinor?: boolean;
  isPrimaryRegistrant?: boolean;
  isRestricted?: null | boolean;
  isVerified?: null | boolean;
  lastName?: string;
  linkedRegistrantId?: null | string;
  type?: HouseholdMemberType;
}
