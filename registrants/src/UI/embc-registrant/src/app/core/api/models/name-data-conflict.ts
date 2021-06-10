/* eslint-disable */
/* eslint-disable */
import { ProfileDataConflict } from './profile-data-conflict';
import { ValueTupleOfStringAndString } from './value-tuple-of-string-and-string';
export interface NameDataConflict extends ProfileDataConflict {
  conflictingValue: ValueTupleOfStringAndString;
  dataElementName: string;
  originalValue: ValueTupleOfStringAndString;
}
