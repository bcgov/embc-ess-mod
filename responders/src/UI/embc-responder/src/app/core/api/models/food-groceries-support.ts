/* tslint:disable */
/* eslint-disable */
import { Support } from './support';
import { SupportCategory } from './support-category';
import { SupportSubCategory } from './support-sub-category';
export type FoodGroceriesSupport = Support & {
'category': SupportCategory;
'subCategory': SupportSubCategory;
'numberOfDays': number;
'totalAmount': number;
'approverName'?: string;
};
