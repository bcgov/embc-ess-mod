/* tslint:disable */
/* eslint-disable */
import { HouseholdMemberType } from '../models/household-member-type';
export interface EvacuationFileHouseholdMember {
  dateOfBirth?: string | null;
  email?: string | null;
  firstName?: string | null;
  gender?: string | null;
  id?: string | null;
  initials?: string | null;
  isHouseholdMember?: boolean;
  isMinor?: boolean;
  isPrimaryRegistrant?: boolean;
  isRestricted?: boolean | null;
  isVerified?: boolean | null;
  lastName?: string | null;
  linkedRegistrantId?: string | null;
  phone?: string | null;
  type?: HouseholdMemberType;
}
