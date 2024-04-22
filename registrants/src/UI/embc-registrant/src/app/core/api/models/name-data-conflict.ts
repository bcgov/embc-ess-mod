/* tslint:disable */
/* eslint-disable */
import { ProfileDataConflict } from './profile-data-conflict';
import { ProfileName } from './profile-name';
export type NameDataConflict = ProfileDataConflict & {
'dataElementName': string;
'conflictingValue'?: ProfileName;
'originalValue'?: ProfileName;
};
