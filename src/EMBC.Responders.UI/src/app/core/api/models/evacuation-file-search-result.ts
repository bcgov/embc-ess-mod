/* tslint:disable */
/* eslint-disable */
import { Address } from './address';
import { EvacuationFileSearchResultHouseholdMember } from './evacuation-file-search-result-household-member';
import { EvacuationFileStatus } from './evacuation-file-status';
export interface EvacuationFileSearchResult {
  createdOn?: string;
  evacuatedFrom?: Address;
  externalReferenceId?: string;
  householdMembers?: Array<EvacuationFileSearchResultHouseholdMember>;
  id?: string;
  isPaperBasedFile?: boolean;
  isRestricted?: boolean;
  modifiedOn?: string;
  status?: EvacuationFileStatus;
  taskEndDate?: null | string;
  taskId?: string;
  taskLocationCommunityCode?: string;
  taskStartDate?: null | string;
}
