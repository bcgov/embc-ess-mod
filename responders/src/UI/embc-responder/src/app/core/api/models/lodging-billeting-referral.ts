/* tslint:disable */
/* eslint-disable */
import { Referral } from './referral';
import { SupportCategory } from './support-category';
import { SupportSubCategory } from './support-sub-category';
export interface LodgingBilletingReferral extends Referral {
  category: SupportCategory;
  hostAddress?: string;
  hostCity?: string;
  hostEmail?: string;
  hostName?: string;
  hostPhone?: string;
  numberOfNights: number;
  subCategory: SupportSubCategory;
}
