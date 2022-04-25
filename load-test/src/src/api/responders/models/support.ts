/* tslint:disable */
/* eslint-disable */
import { SupportCategory } from './support-category';
import { SupportDelivery } from './support-delivery';
import { SupportMethod } from './support-method';
import { SupportStatus } from './support-status';
import { SupportSubCategory } from './support-sub-category';
export interface Support {
  category: SupportCategory;
  createdBy?: null | string;
  createdByTeam?: null | string;
  createdOn?: null | string;
  fileId?: null | string;
  from: string;
  id?: null | string;
  includedHouseholdMembers: Array<string>;
  issuedBy?: null | string;
  issuedByTeam?: null | string;
  issuedOn?: null | string;
  method?: SupportMethod;
  needsAssessmentId?: null | string;
  status?: SupportStatus;
  subCategory?: SupportSubCategory;
  supportDelivery: SupportDelivery;
  to: string;
}
