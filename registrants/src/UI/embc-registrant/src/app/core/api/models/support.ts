/* tslint:disable */
/* eslint-disable */
import { SupportStatus } from './support-status';
export interface Support {
  from?: string;
  id?: null | string;
  includedHouseholdMembers?: null | Array<string>;
  issuedOn?: string;
  issuingMemberTeamName?: null | string;
  status?: SupportStatus;
  to?: string;
}
