/* tslint:disable */
/* eslint-disable */
import { Referral } from './referral';
import { SupportCategory } from './support-category';
import { SupportSubCategory } from './support-sub-category';
export interface ClothingReferral extends Referral {
  category?: SupportCategory;
  extremeWinterConditions?: boolean;
  subCategory?: SupportSubCategory;
  totalAmount?: number;
}
