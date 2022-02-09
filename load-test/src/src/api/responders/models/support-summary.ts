/* tslint:disable */
/* eslint-disable */
import { SupportCategory } from './support-category';
import { SupportMethod } from './support-method';
import { SupportStatus } from './support-status';
import { SupportSubCategory } from './support-sub-category';
export interface SupportSummary {
  category?: SupportCategory;
  externalReferenceId?: null | string;
  fileId?: string;
  from?: string;
  id?: string;
  method?: SupportMethod;
  status?: SupportStatus;
  subCategory?: null | SupportSubCategory;
  to?: string;
}
