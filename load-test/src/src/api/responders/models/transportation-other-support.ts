/* tslint:disable */
/* eslint-disable */
import { Support } from './support';
import { SupportCategory } from './support-category';
import { SupportSubCategory } from './support-sub-category';
export type TransportationOtherSupport = Support & {
'category': SupportCategory;
'subCategory': SupportSubCategory;
'totalAmount': number;
'transportMode': string;
};
