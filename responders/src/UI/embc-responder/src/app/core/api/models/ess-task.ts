/* tslint:disable */
/* eslint-disable */
import { TaskWorkflow } from '../models/task-workflow';
export interface EssTask {
  communityCode?: string | null;
  description?: string | null;
  endDate?: string;
  id?: string | null;
  startDate?: string;
  status?: string | null;
  workflows?: Array<TaskWorkflow> | null;
}
