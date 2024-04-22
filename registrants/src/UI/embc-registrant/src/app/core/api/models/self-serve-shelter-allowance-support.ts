/* tslint:disable */
/* eslint-disable */
import { SelfServeSupport } from './self-serve-support';
import { SupportDay } from './support-day';
export type SelfServeShelterAllowanceSupport = SelfServeSupport & {
'nights'?: Array<SupportDay>;
};
