/* tslint:disable */
/* eslint-disable */
import { Support } from './support';
import { SupportCategory } from './support-category';
import { SupportSubCategory } from './support-sub-category';
export interface LodgingGroupSupport extends Support {
  category?: SupportCategory;
  facilityAddress?: string;
  facilityCity?: string;
  facilityCommunityCode?: string;
  facilityContactPhone?: string;
  facilityName?: string;
  numberOfNights?: number;
  subCategory?: SupportSubCategory;
}
