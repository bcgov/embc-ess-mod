/* tslint:disable */
/* eslint-disable */
import { Address } from './address';
import { EvacuationFileSearchResult } from './evacuation-file-search-result';
import { RegistrantStatus } from './registrant-status';
export interface RegistrantProfileSearchResult {
  createdOn?: string;
  evacuationFiles?: null | Array<EvacuationFileSearchResult>;
  firstName?: null | string;
  id?: null | string;
  isRestricted?: boolean;
  lastName?: null | string;
  primaryAddress?: null | Address;
  status?: RegistrantStatus;
}
