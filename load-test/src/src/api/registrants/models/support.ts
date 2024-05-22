/* tslint:disable */
/* eslint-disable */
import { Address } from './address';
import { SupportCategory } from './support-category';
import { SupportMethod } from './support-method';
import { SupportStatus } from './support-status';
import { SupportSubCategory } from './support-sub-category';
export interface Support {
  category?: SupportCategory;
  from?: string;
  id?: null | string;
  includedHouseholdMembers?: null | Array<string>;
  isSelfServe?: boolean;
  issuedOn?: string;
  issuedToPersonName?: null | string;
  issuingMemberTeamName?: null | string;
  manualReferralId?: null | string;
  method?: SupportMethod;
  nofificationMobile?: null | string;
  notificationEmail?: null | string;
  recipientFirstName?: null | string;
  recipientLastName?: null | string;
  securityAnswer?: null | string;
  securityQuestion?: null | string;
  status?: SupportStatus;
  subCategory?: SupportSubCategory;
  supplierAddress?: Address;
  supplierId?: null | string;
  supplierLegalName?: null | string;
  supplierName?: null | string;
  to?: string;
}
