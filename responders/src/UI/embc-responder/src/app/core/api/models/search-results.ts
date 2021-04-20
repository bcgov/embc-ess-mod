/* tslint:disable */
/* eslint-disable */
import { EvacuationFileSearchResult } from './evacuation-file-search-result';
import { RegistrantProfileSearchResult } from './registrant-profile-search-result';
export interface SearchResults {
  files?: null | Array<EvacuationFileSearchResult>;
  registrants?: null | Array<RegistrantProfileSearchResult>;
}
