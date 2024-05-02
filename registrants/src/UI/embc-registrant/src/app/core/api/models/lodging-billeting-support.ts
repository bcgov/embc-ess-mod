/* tslint:disable */
/* eslint-disable */
import { Support } from '../models/support';
import { SupportCategory } from '../models/support-category';
import { SupportSubCategory } from '../models/support-sub-category';
export type LodgingBilletingSupport = Support & {
  category?: SupportCategory;
  subCategory?: SupportSubCategory;
  numberOfNights?: number;
  hostName?: string | null;
  hostAddress?: string | null;
  hostCity?: string | null;
  hostEmail?: string | null;
  hostPhone?: string | null;
};
