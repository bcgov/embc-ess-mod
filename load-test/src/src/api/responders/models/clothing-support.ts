/* tslint:disable */
/* eslint-disable */
import { Support } from './support';
import { SupportCategory } from './support-category';
import { SupportSubCategory } from './support-sub-category';
export type ClothingSupport = Support & {
'extremeWinterConditions'?: boolean;
'category': SupportCategory;
'subCategory': SupportSubCategory;
'totalAmount': number;
'approverName'?: string;
};
