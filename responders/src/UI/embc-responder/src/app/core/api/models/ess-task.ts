/* tslint:disable */
/* eslint-disable */
import { TaskWorkflow } from './task-workflow';
export interface EssTask {
  communityCode?: string;
  description?: string;
  endDate?: string;
  id?: string;
  startDate?: string;
  status?: string;
  workflows?: Array<TaskWorkflow>;
}
