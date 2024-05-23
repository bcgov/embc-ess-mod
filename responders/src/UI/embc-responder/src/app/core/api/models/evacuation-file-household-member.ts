/* tslint:disable */
/* eslint-disable */
import { HouseholdMemberType } from '../models/household-member-type';
export interface EvacuationFileHouseholdMember {
  dateOfBirth?: string;
  firstName?: string;
  gender?: string;
  id?: string | null;
  initials?: string | null;
  isHouseholdMember?: boolean;
  isMinor?: boolean;
  isPrimaryRegistrant?: boolean;
  isRestricted?: boolean | null;
  isVerified?: boolean | null;
  lastName?: string;
  linkedRegistrantId?: string | null;
  type?: HouseholdMemberType;
}
