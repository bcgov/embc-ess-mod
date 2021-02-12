/* tslint:disable */
/* eslint-disable */
import { ProfileDataConflict } from './profile-data-conflict';
export interface NameDataConflict extends ProfileDataConflict {
  conflictingValue?: null | string;
  dataElementName?: null | string;
  originalValue?: null | string;
}
