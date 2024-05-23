/* tslint:disable */
/* eslint-disable */
import { HouseholdMemberType } from '../models/household-member-type';
export interface EvacuationFileSearchResultHouseholdMember {
  firstName?: string;
  id?: string;
  isMainApplicant?: boolean;
  isRestricted?: boolean | null;
  isSearchMatch?: boolean;
  lastName?: string;
  type?: HouseholdMemberType;
}
