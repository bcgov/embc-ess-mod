/* tslint:disable */
/* eslint-disable */
import { SelfServeSupport } from './self-serve-support';
import { SelfServeSupportType } from './self-serve-support-type';
export type SelfServeFoodGroceriesSupport = SelfServeSupport & {
'includedHouseholdMembers'?: Array<string> | null;
'nights'?: Array<string> | null;
'type'?: SelfServeSupportType;
};
