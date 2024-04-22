/* tslint:disable */
/* eslint-disable */
import { SelfServeSupport } from './self-serve-support';
import { SupportDayMeals } from './support-day-meals';
export type SelfServeFoodRestaurantSupport = SelfServeSupport & {
'includedHouseholdMembers'?: Array<string>;
'meals'?: Array<SupportDayMeals>;
};
