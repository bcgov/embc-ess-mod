/* tslint:disable */
/* eslint-disable */
import { Support } from '../models/support';
import { SupportCategory } from '../models/support-category';
import { SupportSubCategory } from '../models/support-sub-category';
export type IncidentalsSupport = Support & {
  category?: SupportCategory;
  subCategory?: SupportSubCategory;
  approvedItems?: string | null;
  totalAmount?: number;
};
