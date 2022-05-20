/* tslint:disable */
/* eslint-disable */
import { ProfileDataConflict } from './profile-data-conflict';
import { ProfileName } from './profile-name';
export interface NameDataConflict extends ProfileDataConflict {
  conflictingValue?: ProfileName;
  dataElementName: string;
  originalValue?: ProfileName;
}
