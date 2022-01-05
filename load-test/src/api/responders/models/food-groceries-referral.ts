/* tslint:disable */
/* eslint-disable */
import { Referral } from './referral';
import { SupportCategory } from './support-category';
import { SupportSubCategory } from './support-sub-category';
export interface FoodGroceriesReferral extends Referral {
  category: SupportCategory;
  numberOfDays: number;
  subCategory: SupportSubCategory;
  totalAmount: number;
}
