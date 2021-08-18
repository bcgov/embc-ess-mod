/* tslint:disable */
/* eslint-disable */
import { Referral } from './referral';
import { SupportCategory } from './support-category';
import { SupportSubCategory } from './support-sub-category';
export interface LodgingGroupReferral extends Referral {
  category?: SupportCategory;
  numberOfNights: number;
  subCategory?: SupportSubCategory;
}
