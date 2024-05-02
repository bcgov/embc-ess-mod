/* tslint:disable */
/* eslint-disable */
import { SelfServeSupport } from '../models/self-serve-support';
import { SelfServeSupportType } from '../models/self-serve-support-type';
import { SupportDay } from '../models/support-day';
export type SelfServeFoodGroceriesSupport = SelfServeSupport & {
  nights?: Array<SupportDay> | null;
  type?: SelfServeSupportType;
};
