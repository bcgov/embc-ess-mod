/* tslint:disable */
/* eslint-disable */
import { SelfServeSupport } from '../models/self-serve-support';
import { SelfServeSupportType } from '../models/self-serve-support-type';
export type SelfServeClothingSupport = SelfServeSupport & {
  includedHouseholdMembers?: Array<string> | null;
  type?: SelfServeSupportType;
};
