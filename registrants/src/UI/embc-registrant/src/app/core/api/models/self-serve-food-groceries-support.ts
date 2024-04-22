/* tslint:disable */
/* eslint-disable */
import { SelfServeSupport } from './self-serve-support';
import { SupportDay } from './support-day';
export type SelfServeFoodGroceriesSupport = SelfServeSupport & {
'nights'?: Array<SupportDay>;
};
