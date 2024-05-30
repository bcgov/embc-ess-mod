/* tslint:disable */
/* eslint-disable */
import { ProfileDataConflict } from '../models/profile-data-conflict';
import { ProfileName } from '../models/profile-name';
export type NameDataConflict = ProfileDataConflict & {
  dataElementName: string;
  conflictingValue?: ProfileName;
  originalValue?: ProfileName;
};
