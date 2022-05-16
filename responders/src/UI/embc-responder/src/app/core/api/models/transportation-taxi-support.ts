/* tslint:disable */
/* eslint-disable */
import { Support } from './support';
import { SupportCategory } from './support-category';
import { SupportSubCategory } from './support-sub-category';
export type TransportationTaxiSupport = Support & {
'category': SupportCategory;
'subCategory': SupportSubCategory;
'fromAddress': string;
'toAddress': string;
};
