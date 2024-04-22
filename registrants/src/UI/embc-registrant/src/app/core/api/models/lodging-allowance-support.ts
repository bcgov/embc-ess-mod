/* tslint:disable */
/* eslint-disable */
import { Support } from './support';
import { SupportCategory } from './support-category';
import { SupportSubCategory } from './support-sub-category';
export type LodgingAllowanceSupport = Support & {
'category'?: SupportCategory;
'subCategory'?: SupportSubCategory;
'numberOfNights'?: number;
'contactPhone'?: string | null;
'contactEmail'?: string | null;
'totalAmount'?: number;
};
