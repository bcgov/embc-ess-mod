import { EvacuationFileSearchResult, RegistrantStatus, SearchResults } from '../api/models';
import { AddressModel } from './address.model';

export interface EvacueeSearchResults extends SearchResults {
  files?: null | Array<EvacuationFileSearchResult>;
  registrants?: null | Array<RegistrantProfileSearchResultModel>;
}

export interface RegistrantProfileSearchResultModel {
  createdOn?: string;
  evacuationFiles?: null | Array<EvacuationFileSearchResult>;
  firstName?: null | string;
  id?: null | string;
  isRestricted?: boolean;
  lastName?: null | string;
  primaryAddress?: null | AddressModel;
  status?: RegistrantStatus;
}
