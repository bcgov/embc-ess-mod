/* tslint:disable */
/* eslint-disable */
import { Address } from './address';
import { ProfileDataConflict } from './profile-data-conflict';
export type AddressDataConflict = ProfileDataConflict & {
'dataElementName': string;
'conflictingValue'?: Address;
'originalValue'?: Address;
};
