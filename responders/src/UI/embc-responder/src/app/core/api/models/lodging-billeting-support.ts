/* tslint:disable */
/* eslint-disable */
import { Support } from './support';
import { SupportCategory } from './support-category';
import { SupportSubCategory } from './support-sub-category';
export interface LodgingBilletingSupport extends Support {
  category: SupportCategory;
  hostAddress?: string;
  hostCity?: string;
  hostEmail?: string;
  hostName?: string;
  hostPhone?: string;
  numberOfNights: number;
  subCategory: SupportSubCategory;
}
