/* eslint-disable */
/* eslint-disable */

/**
 * Address data with optional lookup code
 */
export interface Address {
  addressLine1: string;
  addressLine2?: null | string;
  community?: null | string;
  country: string;
  jurisdiction: string;
  postalCode?: null | string;
  stateProvince?: null | string;
}
