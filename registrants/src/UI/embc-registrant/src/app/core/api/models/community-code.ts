/* tslint:disable */
/* eslint-disable */
import { CommunityType } from '../models/community-type';
export interface CommunityCode {
  communityType?: CommunityType;
  countryCode?: string | null;
  description?: string | null;
  districtName?: string | null;
  isActive?: boolean;
  stateProvinceCode?: string | null;
  value?: string | null;
}
