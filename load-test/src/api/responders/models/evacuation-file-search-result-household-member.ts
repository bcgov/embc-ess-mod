/* tslint:disable */
/* eslint-disable */
import { HouseholdMemberType } from './household-member-type';
export interface EvacuationFileSearchResultHouseholdMember {
  firstName?: null | string;
  id?: null | string;
  isMainApplicant?: boolean;
  isRestricted?: null | boolean;
  isSearchMatch?: boolean;
  lastName?: null | string;
  type?: HouseholdMemberType;
}
