/* tslint:disable */
/* eslint-disable */
import { Address } from '../models/address';
import { SupportCategory } from '../models/support-category';
import { SupportMethod } from '../models/support-method';
import { SupportStatus } from '../models/support-status';
import { SupportSubCategory } from '../models/support-sub-category';
export interface Support {
  category?: SupportCategory;
  from?: string;
  id?: string | null;
  includedHouseholdMembers?: Array<string> | null;
  isSelfServe?: boolean;
  issuedOn?: string;
  issuedToPersonName?: string | null;
  issuingMemberTeamName?: string | null;
  manualReferralId?: string | null;
  method?: SupportMethod;
  nofificationMobile?: string | null;
  notificationEmail?: string | null;
  recipientFirstName?: string | null;
  recipientLastName?: string | null;
  securityAnswer?: string | null;
  securityQuestion?: string | null;
  status?: SupportStatus;
  subCategory?: SupportSubCategory;
  supplierAddress?: Address;
  supplierId?: string | null;
  supplierLegalName?: string | null;
  supplierName?: string | null;
  to?: string;
}
