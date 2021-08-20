/* tslint:disable */
/* eslint-disable */
import { SupportStatus } from './support-status';
export interface Support {
  from: string;
  id?: null | string;
  includedHouseholdMembers: Array<string>;
  issuedOn?: string;
  issuingMemberName?: null | string;
  issuingMemberTeamName?: null | string;
  needsAssessmentId?: null | string;
  status?: SupportStatus;
  to: string;
}
