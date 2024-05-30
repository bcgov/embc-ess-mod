/* tslint:disable */
/* eslint-disable */
import { ProfileDataConflict } from '../models/profile-data-conflict';
export type DateOfBirthDataConflict = ProfileDataConflict & {
  dataElementName: string;
  conflictingValue?: string | null;
  originalValue?: string | null;
};
