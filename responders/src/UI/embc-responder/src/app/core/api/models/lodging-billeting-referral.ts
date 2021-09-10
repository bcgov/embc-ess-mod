/* tslint:disable */
/* eslint-disable */
import { Referral } from './referral';
import { SupportCategory } from './support-category';
import { SupportSubCategory } from './support-sub-category';
export interface LodgingBilletingReferral extends Referral {
  category: SupportCategory;
  hostAddress?: null | string;
  hostCity?: null | string;
  hostEmail?: null | string;
  hostName?: null | string;
  hostPhone?: null | string;
  numberOfNights: number;
  subCategory: SupportSubCategory;
}
