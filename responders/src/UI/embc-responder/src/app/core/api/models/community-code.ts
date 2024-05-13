/* tslint:disable */
/* eslint-disable */
import { Code } from '../models/code';
import { CommunityType } from '../models/community-type';
export type CommunityCode = Code & {
  communityType?: CommunityType;
  districtName?: string;
};
