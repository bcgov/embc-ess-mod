/* tslint:disable */
/* eslint-disable */
import { Support } from './support';
import { SupportCategory } from './support-category';
import { SupportSubCategory } from './support-sub-category';
export type LodgingBilletingSupport = Support & {
'category': SupportCategory;
'subCategory': SupportSubCategory;
'numberOfNights': number;
'hostName'?: string;
'hostAddress'?: string;
'hostCity'?: string;
'hostEmail'?: string;
'hostPhone'?: string;
};
