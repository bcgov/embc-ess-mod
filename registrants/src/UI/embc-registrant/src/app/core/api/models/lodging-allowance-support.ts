/* tslint:disable */
/* eslint-disable */
import { Support } from '../models/support';
import { SupportCategory } from '../models/support-category';
import { SupportSubCategory } from '../models/support-sub-category';
export type LodgingAllowanceSupport = Support & {
  category?: SupportCategory;
  subCategory?: SupportSubCategory;
  numberOfNights?: number;
  contactPhone?: string | null;
  contactEmail?: string | null;
  totalAmount?: number;
};
