/* tslint:disable */
/* eslint-disable */
import { ProfileDataConflict } from './profile-data-conflict';
export interface DateOfBirthDataConflict extends ProfileDataConflict {
  conflictingValue?: null | string;
  dataElementName?: null | string;
  originalValue?: null | string;
}
