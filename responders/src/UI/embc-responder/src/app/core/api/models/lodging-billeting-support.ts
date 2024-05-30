/* tslint:disable */
/* eslint-disable */
import { Support } from '../models/support';
import { SupportCategory } from '../models/support-category';
import { SupportSubCategory } from '../models/support-sub-category';
export type LodgingBilletingSupport = Support & {
  category: SupportCategory;
  subCategory: SupportSubCategory;
  numberOfNights: number;
  hostName?: string;
  hostAddress?: string;
  hostCity?: string;
  hostEmail?: string;
  hostPhone?: string;
};
