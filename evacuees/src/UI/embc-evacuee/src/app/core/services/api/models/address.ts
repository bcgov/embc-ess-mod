/* tslint:disable */

/**
 * Address data with optional lookup code
 */
export interface Address {
  addressLine1: string;
  addressLine2?: null | string;
  countryCode: string;
  jurisdictionCode?: null | string;
  jurisdictionName?: null | string;
  postalCode: string;
  stateProvinceCode?: null | string;
  stateProvinceName?: null | string;
}
