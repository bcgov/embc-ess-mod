/* tslint:disable */
/* eslint-disable */
import { Address } from '../models/address';
import { ProfileDataConflict } from '../models/profile-data-conflict';
export type AddressDataConflict = ProfileDataConflict & {
  dataElementName: string;
  conflictingValue?: Address;
  originalValue?: Address;
};
