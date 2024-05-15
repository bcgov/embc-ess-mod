/* tslint:disable */
/* eslint-disable */
import { SelfServeSupport } from './self-serve-support';
import { SelfServeSupportType } from './self-serve-support-type';
export type SelfServeClothingSupport = SelfServeSupport & {
'includedHouseholdMembers'?: Array<string> | null;
'type'?: SelfServeSupportType;
};
