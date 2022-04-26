import {
  EvacuationFileSearchResult,
  RegistrantProfileSearchResult
} from '../api/models';
import { AddressModel } from './address.model';

export interface EvacueeSearchResults {
  files?: null | Array<EvacuationFileSearchResultModel>;
  registrants?: null | Array<RegistrantProfileSearchResultModel>;
}

export interface RegistrantProfileSearchResultModel
  extends RegistrantProfileSearchResult {
  primaryAddress?: null | AddressModel;
  evacuationFiles?: null | Array<EvacuationFileSearchResultModel>;
}

export interface EvacuationFileSearchResultModel
  extends EvacuationFileSearchResult {
  evacuatedFrom?: null | AddressModel;
}
