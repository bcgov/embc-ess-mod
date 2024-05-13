/* tslint:disable */
/* eslint-disable */
import { Address } from '../models/address';
import { EvacuationFileSearchResultHouseholdMember } from '../models/evacuation-file-search-result-household-member';
import { EvacuationFileStatus } from '../models/evacuation-file-status';
export interface EvacuationFileSearchResult {
  createdOn?: string;
  evacuatedFrom?: Address;
  householdMembers?: Array<EvacuationFileSearchResultHouseholdMember>;
  id?: string;
  isFileCompleted?: boolean;
  isPaperBasedFile?: boolean;
  isRestricted?: boolean;
  manualFileId?: string;
  modifiedOn?: string;
  status?: EvacuationFileStatus;
  taskEndDate?: string | null;
  taskId?: string;
  taskLocationCommunityCode?: string;
  taskStartDate?: string | null;
}
