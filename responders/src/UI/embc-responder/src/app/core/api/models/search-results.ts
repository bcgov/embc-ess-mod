/* tslint:disable */
/* eslint-disable */
import { EvacuationFileSearchResult } from './evacuation-file-search-result';
import { RegistrantProfileSearchResult } from './registrant-profile-search-result';
export interface SearchResults {
  files?: Array<EvacuationFileSearchResult>;
  registrants?: Array<RegistrantProfileSearchResult>;
}
