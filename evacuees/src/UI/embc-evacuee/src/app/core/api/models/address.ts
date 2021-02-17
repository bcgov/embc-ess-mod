/* tslint:disable */
/* eslint-disable */
import { Country } from './country';
import { Jurisdiction } from './jurisdiction';
import { StateProvince } from './state-province';

/**
 * Address data with optional lookup code
 */
export interface Address {
  addressLine1: string;
  addressLine2?: null | string;
  country: Country;
  jurisdiction: Jurisdiction;
  postalCode?: null | string;
  stateProvince?: null | StateProvince;
}
