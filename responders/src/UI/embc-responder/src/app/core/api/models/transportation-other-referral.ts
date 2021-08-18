/* tslint:disable */
/* eslint-disable */
import { Referral } from './referral';
import { SupportCategory } from './support-category';
import { SupportSubCategory } from './support-sub-category';
export interface TransportationOtherReferral extends Referral {
  category?: SupportCategory;
  subCategory?: SupportSubCategory;
  totalAmount: number;
  transportMode: string;
}
