/* tslint:disable */
/* eslint-disable */
import { Address } from '../models/address';
import { EvacuationFileSearchResultHouseholdMember } from '../models/evacuation-file-search-result-household-member';
import { EvacuationFileStatus } from '../models/evacuation-file-status';
export interface EvacuationFileSearchResult {
  createdOn?: string;
  evacuatedFrom?: Address;
  householdMembers?: Array<EvacuationFileSearchResultHouseholdMember> | null;
  id?: string | null;
  isFileCompleted?: boolean;
  isPaperBasedFile?: boolean;
  isRestricted?: boolean;
  manualFileId?: string | null;
  modifiedOn?: string;
  status?: EvacuationFileStatus;
  taskEndDate?: string | null;
  taskId?: string | null;
  taskLocationCommunityCode?: string | null;
  taskStartDate?: string | null;
}
