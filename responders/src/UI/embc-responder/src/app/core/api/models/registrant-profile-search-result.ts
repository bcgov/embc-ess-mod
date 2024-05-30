/* tslint:disable */
/* eslint-disable */
import { Address } from '../models/address';
import { EvacuationFileSearchResult } from '../models/evacuation-file-search-result';
import { RegistrantStatus } from '../models/registrant-status';
export interface RegistrantProfileSearchResult {
  createdOn?: string;
  evacuationFiles?: Array<EvacuationFileSearchResult>;
  firstName?: string;
  id?: string;
  isAuthenticated?: boolean;
  isProfileCompleted?: boolean;
  isRestricted?: boolean;
  lastName?: string;
  modifiedOn?: string;
  primaryAddress?: Address;
  status?: RegistrantStatus;
}
