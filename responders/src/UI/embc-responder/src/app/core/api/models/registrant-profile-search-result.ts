/* tslint:disable */
/* eslint-disable */
import { Address } from './address';
import { EvacuationFileSearchResult } from './evacuation-file-search-result';
import { RegistrantStatus } from './registrant-status';
export interface RegistrantProfileSearchResult {
  createdOn?: string;
  evacuationFiles?: Array<EvacuationFileSearchResult>;
  firstName?: string;
  id?: string;
  isRestricted?: boolean;
  lastName?: string;
  modifiedOn?: string;
  primaryAddress?: Address;
  status?: RegistrantStatus;
}
