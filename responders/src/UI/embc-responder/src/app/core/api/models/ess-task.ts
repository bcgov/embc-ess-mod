/* tslint:disable */
/* eslint-disable */
import { TaskWorkflow } from '../models/task-workflow';
import { SupportLimit } from './support-limit';
export interface EssTask {
  communityCode?: string | null;
  description?: string | null;
  endDate?: string;
  id?: string | null;
  startDate?: string;
  status?: string | null;
  workflows?: Array<TaskWorkflow> | null;
  supportLimits?: Array<SupportLimit> | null;
}
