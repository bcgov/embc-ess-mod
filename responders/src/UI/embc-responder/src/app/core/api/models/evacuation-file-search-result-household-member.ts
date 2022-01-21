/* tslint:disable */
/* eslint-disable */
import { HouseholdMemberType } from './household-member-type';
export interface EvacuationFileSearchResultHouseholdMember {
  firstName?: string;
  id?: string;
  isMainApplicant?: boolean;
  isRestricted?: null | boolean;
  isSearchMatch?: boolean;
  lastName?: string;
  type?: HouseholdMemberType;
}
