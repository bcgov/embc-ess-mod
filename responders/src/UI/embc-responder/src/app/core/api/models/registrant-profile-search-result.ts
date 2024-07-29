/* tslint:disable */
/* eslint-disable */
import { Address } from '../models/address';
import { EvacuationFileSearchResult } from '../models/evacuation-file-search-result';
import { RegistrantStatus } from '../models/registrant-status';
export interface RegistrantProfileSearchResult {
  createdOn?: string;
  evacuationFiles?: Array<EvacuationFileSearchResult> | null;
  firstName?: string | null;
  id?: string | null;
  isAuthenticated?: boolean;
  isMinor?: boolean;
  isProfileCompleted?: boolean;
  isRestricted?: boolean;
  lastName?: string | null;
  modifiedOn?: string;
  primaryAddress?: Address;
  status?: RegistrantStatus;
}
