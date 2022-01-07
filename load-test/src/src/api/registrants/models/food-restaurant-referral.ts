/* tslint:disable */
/* eslint-disable */
import { Referral } from './referral';
import { SupportCategory } from './support-category';
import { SupportSubCategory } from './support-sub-category';
export interface FoodRestaurantReferral extends Referral {
  category?: SupportCategory;
  numberOfBreakfastsPerPerson?: number;
  numberOfDinnersPerPerson?: number;
  numberOfLunchesPerPerson?: number;
  subCategory?: SupportSubCategory;
  totalAmount?: number;
}
