/* tslint:disable */
/* eslint-disable */
import { Address } from '../models/address';
import { EvacuationFileStatus } from '../models/evacuation-file-status';
import { EvacuationFileTask } from '../models/evacuation-file-task';
export interface EvacuationFileSummary {
  createdOn?: string;
  evacuatedFromAddress?: Address;
  evacuationFileDate?: string;
  hasSupports?: boolean;
  id?: string | null;
  isPaper?: boolean | null;
  isPerliminary?: boolean;
  isRestricted?: boolean | null;
  issuedOn?: string;
  manualFileId?: string | null;
  status?: EvacuationFileStatus;
  task?: EvacuationFileTask;
}
