import {
  EvacuationFileHouseholdMember,
  EvacuationFileSearchResult,
  EvacuationFileStatus,
  RegistrantStatus,
  SearchResults
} from '../api/models';
import { AddressModel } from './address.model';

export interface EvacueeSearchResults extends SearchResults {
  files?: null | Array<EvacuationFileSearchResultModel>;
  registrants?: null | Array<RegistrantProfileSearchResultModel>;
}

export interface RegistrantProfileSearchResultModel {
  createdOn?: string;
  evacuationFiles?: null | Array<EvacuationFileSearchResultModel>;
  firstName?: null | string;
  id?: null | string;
  isRestricted?: boolean;
  lastName?: null | string;
  primaryAddress?: null | AddressModel;
  status?: RegistrantStatus;
}

export interface EvacuationFileSearchResultModel {
  createdOn?: string;
  evacuatedFrom?: null | AddressModel;
  householdMembers?: null | Array<EvacuationFileHouseholdMember>;
  id?: null | string;
  isRestricted?: boolean;
  modifiedOn?: string;
  status?: EvacuationFileStatus;
  taskId?: null | string;
}
