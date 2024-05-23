/* tslint:disable */
/* eslint-disable */
import { Support } from '../models/support';
import { SupportCategory } from '../models/support-category';
import { SupportSubCategory } from '../models/support-sub-category';
export type FoodRestaurantSupport = Support & {
  category: SupportCategory;
  subCategory: SupportSubCategory;
  numberOfBreakfastsPerPerson: number;
  numberOfLunchesPerPerson: number;
  numberOfDinnersPerPerson: number;
  totalAmount: number;
};
