/* eslint-disable */
/* eslint-disable */
import { CommunityType } from './community-type';

/**
 * A community in the system
 */
export interface Community {
  code?: null | string;
  countryCode?: null | string;
  districtName?: null | string;
  name?: null | string;
  stateProvinceCode?: null | string;
  type?: CommunityType;
}
