/* tslint:disable */
/* eslint-disable */
import { Address } from './address';
import { ProfileDataConflict } from './profile-data-conflict';
export interface AddressDataConflict extends ProfileDataConflict {
  conflictingValue?: null | Address;
  dataElementName?: null | string;
  originalValue?: null | Address;
}
