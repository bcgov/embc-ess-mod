/* tslint:disable */
/* eslint-disable */
import { Support } from './support';
import { SupportCategory } from './support-category';
import { SupportSubCategory } from './support-sub-category';
export interface FoodRestaurantSupport extends Support {
  category: SupportCategory;
  numberOfBreakfastsPerPerson: number;
  numberOfDinnersPerPerson: number;
  numberOfLunchesPerPerson: number;
  subCategory: SupportSubCategory;
  totalAmount: number;
}
