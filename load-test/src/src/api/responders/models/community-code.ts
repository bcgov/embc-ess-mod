/* tslint:disable */
/* eslint-disable */
import { Code } from './code';
import { CommunityType } from './community-type';
export type CommunityCode = Code & {
'communityType'?: CommunityType;
'districtName'?: string;
};
