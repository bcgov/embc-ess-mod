/* tslint:disable */
/* eslint-disable */
import { SupportCategory } from './support-category';
import { SupportMethod } from './support-method';
import { SupportStatus } from './support-status';
import { SupportSubCategory } from './support-sub-category';
export interface Support {
  category: SupportCategory;
  from: string;
  id?: null | string;
  includedHouseholdMembers: Array<string>;
  issuedOn?: null | string;
  issuingMemberName?: null | string;
  issuingMemberTeamName?: null | string;
  method: SupportMethod;
  needsAssessmentId?: null | string;
  status?: SupportStatus;
  subCategory?: SupportSubCategory;
  to: string;
}
