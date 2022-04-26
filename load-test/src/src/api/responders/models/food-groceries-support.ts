/* tslint:disable */
/* eslint-disable */
import { Support } from './support';
import { SupportCategory } from './support-category';
import { SupportSubCategory } from './support-sub-category';
export interface FoodGroceriesSupport extends Support {
  approverName?: string;
  category: SupportCategory;
  numberOfDays: number;
  subCategory: SupportSubCategory;
  totalAmount: number;
}
