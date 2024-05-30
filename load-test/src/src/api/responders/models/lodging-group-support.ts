/* tslint:disable */
/* eslint-disable */
import { Support } from './support';
import { SupportCategory } from './support-category';
import { SupportSubCategory } from './support-sub-category';
export type LodgingGroupSupport = Support & {
'category': SupportCategory;
'subCategory': SupportSubCategory;
'numberOfNights': number;
'facilityName'?: string;
'facilityAddress'?: string;
'facilityCity'?: string;
'facilityCommunityCode'?: string;
'facilityContactPhone'?: string;
};
