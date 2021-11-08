/* tslint:disable */
/* eslint-disable */
import { Address } from './address';
import { EvacuationFileSearchResultHouseholdMember } from './evacuation-file-search-result-household-member';
import { EvacuationFileStatus } from './evacuation-file-status';
export interface EvacuationFileSearchResult {
  createdOn?: string;
  evacuatedFrom?: null | Address;
  householdMembers?: null | Array<EvacuationFileSearchResultHouseholdMember>;
  id?: null | string;
  isRestricted?: boolean;
  modifiedOn?: string;
  status?: EvacuationFileStatus;
  taskEndDate?: null | string;
  taskId?: null | string;
  taskLocationCommunityCode?: null | string;
  taskStartDate?: null | string;
}
