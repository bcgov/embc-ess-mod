/* tslint:disable */
/* eslint-disable */
import { Support } from './support';
import { SupportCategory } from './support-category';
import { SupportSubCategory } from './support-sub-category';
export type IncidentalsSupport = Support & {
'category'?: SupportCategory;
'subCategory'?: SupportSubCategory;
'approvedItems'?: string;
'totalAmount'?: number;
};
