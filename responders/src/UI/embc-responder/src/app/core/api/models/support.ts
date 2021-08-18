/* tslint:disable */
/* eslint-disable */
import { SupportStatus } from './support-status';
export interface Support {
  from: string;
  id?: null | string;
  includedHouseholdMembers: Array<string>;
  status?: SupportStatus;
  to: string;
}
