/* tslint:disable */
/* eslint-disable */
import { ProfileDataConflict } from './profile-data-conflict';
export type DateOfBirthDataConflict = ProfileDataConflict & {
'dataElementName': string;
'conflictingValue'?: string;
'originalValue'?: string;
};
