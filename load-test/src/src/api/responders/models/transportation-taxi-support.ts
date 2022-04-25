/* tslint:disable */
/* eslint-disable */
import { Support } from './support';
import { SupportCategory } from './support-category';
import { SupportSubCategory } from './support-sub-category';
export interface TransportationTaxiSupport extends Support {
  category: SupportCategory;
  fromAddress: string;
  subCategory: SupportSubCategory;
  toAddress: string;
}
