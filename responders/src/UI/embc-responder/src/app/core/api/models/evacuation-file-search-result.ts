/* tslint:disable */
/* eslint-disable */
import { Address } from './address';
import { EvacuationFileHouseholdMember } from './evacuation-file-household-member';
import { EvacuationFileStatus } from './evacuation-file-status';
export interface EvacuationFileSearchResult {
  createdOn?: string;
  evacuatedFrom?: null | Address;
  householdMembers?: null | Array<EvacuationFileHouseholdMember>;
  id?: null | string;
  isRestricted?: boolean;
  status?: EvacuationFileStatus;
  taskId?: null | string;
}
