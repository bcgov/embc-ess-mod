/* tslint:disable */
/* eslint-disable */
import { HouseholdMemberType } from '../models/household-member-type';
export interface EvacuationFileSearchResultHouseholdMember {
  firstName?: string | null;
  id?: string | null;
  isMainApplicant?: boolean;
  isRestricted?: boolean | null;
  isSearchMatch?: boolean;
  lastName?: string | null;
  type?: HouseholdMemberType;
}
