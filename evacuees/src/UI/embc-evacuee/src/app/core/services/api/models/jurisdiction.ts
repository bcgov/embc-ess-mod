/* tslint:disable */
import { JurisdictionType } from './jurisdiction-type';
export interface Jurisdiction {
  code?: null | string;
  countryCode?: null | string;
  name?: null | string;
  stateProvinceCode?: null | string;
  type?: JurisdictionType;
}
