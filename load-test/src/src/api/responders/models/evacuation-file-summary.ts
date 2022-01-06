/* tslint:disable */
/* eslint-disable */
import { Address } from './address';
import { EvacuationFileStatus } from './evacuation-file-status';
import { EvacuationFileTask } from './evacuation-file-task';
export interface EvacuationFileSummary {
  createdOn?: string;
  evacuatedFromAddress?: null | Address;
  evacuationFileDate?: string;
  id?: null | string;
  isRestricted?: null | boolean;
  status?: EvacuationFileStatus;
  task?: null | EvacuationFileTask;
}
