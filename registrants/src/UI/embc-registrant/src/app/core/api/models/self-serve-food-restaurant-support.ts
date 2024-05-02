/* tslint:disable */
/* eslint-disable */
import { SelfServeSupport } from '../models/self-serve-support';
import { SelfServeSupportType } from '../models/self-serve-support-type';
import { SupportDayMeals } from '../models/support-day-meals';
export type SelfServeFoodRestaurantSupport = SelfServeSupport & {
  includedHouseholdMembers?: Array<string> | null;
  meals?: Array<SupportDayMeals> | null;
  type?: SelfServeSupportType;
};
