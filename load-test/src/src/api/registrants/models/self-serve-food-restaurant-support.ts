/* tslint:disable */
/* eslint-disable */
import { SelfServeSupport } from './self-serve-support';
import { SelfServeSupportType } from './self-serve-support-type';
import { SupportDayMeals } from './support-day-meals';
export type SelfServeFoodRestaurantSupport = SelfServeSupport & {
'includedHouseholdMembers'?: Array<string> | null;
'meals'?: Array<SupportDayMeals> | null;
'type'?: SelfServeSupportType;
};
