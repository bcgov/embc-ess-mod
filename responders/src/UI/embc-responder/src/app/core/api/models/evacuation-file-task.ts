/* tslint:disable */
/* eslint-disable */
import { EvacuationFileTaskFeature } from '../models/evacuation-file-task-feature';
export interface EvacuationFileTask {
  communityCode?: string | null;
  features?: Array<EvacuationFileTaskFeature>;
  from?: string | null;
  status?: string | null;
  taskNumber: string;
  to?: string | null;
}
