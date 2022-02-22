/* tslint:disable */
/* eslint-disable */
import { Code } from './code';
import { CommunityType } from './community-type';
export interface CommunityCode extends Code {
  communityType?: CommunityType;
  districtName?: string;
}
