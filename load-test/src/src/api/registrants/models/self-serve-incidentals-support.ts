/* tslint:disable */
/* eslint-disable */
import { SelfServeSupport } from './self-serve-support';
import { SelfServeSupportType } from './self-serve-support-type';
export type SelfServeIncidentalsSupport = SelfServeSupport & {
'includedHouseholdMembers'?: Array<string> | null;
'type'?: SelfServeSupportType;
};
