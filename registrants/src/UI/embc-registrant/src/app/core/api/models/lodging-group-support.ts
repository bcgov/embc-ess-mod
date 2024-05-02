/* tslint:disable */
/* eslint-disable */
import { Support } from '../models/support';
import { SupportCategory } from '../models/support-category';
import { SupportSubCategory } from '../models/support-sub-category';
export type LodgingGroupSupport = Support & {
  category?: SupportCategory;
  subCategory?: SupportSubCategory;
  numberOfNights?: number;
  facilityName?: string | null;
  facilityAddress?: string | null;
  facilityCity?: string | null;
  facilityCommunityCode?: string | null;
  facilityContactPhone?: string | null;
};
