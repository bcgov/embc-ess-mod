/* tslint:disable */
/* eslint-disable */
import { Address } from './address';
import { EvacuationFileStatus } from './evacuation-file-status';
import { EvacuationFileTask } from './evacuation-file-task';
export interface EvacuationFileSummary {
  createdOn?: string;
  evacuatedFromAddress?: Address;
  evacuationFileDate?: string;
  id?: string;
  isPaper?: null | boolean;
  isPerliminary?: boolean;
  isRestricted?: null | boolean;
  issuedOn?: string;
  manualFileId?: null | string;
  status?: EvacuationFileStatus;
  task?: null | EvacuationFileTask;
}
