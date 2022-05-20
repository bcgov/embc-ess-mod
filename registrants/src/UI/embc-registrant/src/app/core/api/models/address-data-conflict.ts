/* tslint:disable */
/* eslint-disable */
import { Address } from './address';
import { ProfileDataConflict } from './profile-data-conflict';
export interface AddressDataConflict extends ProfileDataConflict {
  conflictingValue?: Address;
  dataElementName: string;
  originalValue?: Address;
}
