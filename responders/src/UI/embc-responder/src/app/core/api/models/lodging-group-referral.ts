/* tslint:disable */
/* eslint-disable */
import { Referral } from './referral';
import { SupportCategory } from './support-category';
import { SupportSubCategory } from './support-sub-category';
export interface LodgingGroupReferral extends Referral {
  category: SupportCategory;
  facilityAddress?: null | string;
  facilityCity?: null | string;
  facilityCommunityCode?: null | string;
  facilityContactPhone?: null | string;
  facilityName?: null | string;
  numberOfNights: number;
  subCategory: SupportSubCategory;
}
