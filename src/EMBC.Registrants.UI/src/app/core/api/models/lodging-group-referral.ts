/* tslint:disable */
/* eslint-disable */
import { Referral } from './referral';
import { SupportCategory } from './support-category';
import { SupportSubCategory } from './support-sub-category';
export interface LodgingGroupReferral extends Referral {
  category?: SupportCategory;
  facilityAddress?: string;
  facilityCity?: string;
  facilityCommunityCode?: string;
  facilityContactPhone?: string;
  facilityName?: string;
  numberOfNights?: number;
  subCategory?: SupportSubCategory;
}
