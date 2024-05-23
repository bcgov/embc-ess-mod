/* tslint:disable */
/* eslint-disable */
import { SupportCategory } from '../models/support-category';
import { SupportDelivery } from '../models/support-delivery';
import { SupportMethod } from '../models/support-method';
import { SupportStatus } from '../models/support-status';
import { SupportSubCategory } from '../models/support-sub-category';
export interface Support {
  category: SupportCategory;
  createdBy?: string | null;
  createdByTeam?: string | null;
  createdOn?: string | null;
  fileId?: string | null;
  from: string;
  id?: string | null;
  includedHouseholdMembers: Array<string>;
  isSelfServe?: boolean;
  issuedBy?: string | null;
  issuedByTeam?: string | null;
  issuedOn?: string | null;
  method?: SupportMethod;
  needsAssessmentId?: string | null;
  status?: SupportStatus;
  subCategory?: SupportSubCategory;
  supportDelivery: SupportDelivery;
  to: string;
}
