/* tslint:disable */
/* eslint-disable */
import { CommunityType } from './community-type';

/**
 * A community in the system
 */
export interface Community {
  countryId?: null | string;
  districtName?: null | string;
  id?: null | string;
  name?: null | string;
  regionId?: null | string;
  stateProvinceId?: null | string;
  type?: CommunityType;
}
