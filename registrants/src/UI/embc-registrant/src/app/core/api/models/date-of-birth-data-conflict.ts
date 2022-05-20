/* tslint:disable */
/* eslint-disable */
import { ProfileDataConflict } from './profile-data-conflict';
export interface DateOfBirthDataConflict extends ProfileDataConflict {
  conflictingValue?: string;
  dataElementName: string;
  originalValue?: string;
}
