/* tslint:disable */
/* eslint-disable */
import { EvacuationFileTaskFeature } from './evacuation-file-task-feature';
export interface EvacuationFileTask {
  communityCode?: null | string;
  features?: Array<EvacuationFileTaskFeature>;
  from?: null | string;
  status?: null | string;
  taskNumber: string;
  to?: null | string;
}
