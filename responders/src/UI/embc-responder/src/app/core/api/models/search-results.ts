/* tslint:disable */
/* eslint-disable */
import { EvacuationFileSearchResult } from '../models/evacuation-file-search-result';
import { RegistrantProfileSearchResult } from '../models/registrant-profile-search-result';
export interface SearchResults {
  files?: Array<EvacuationFileSearchResult>;
  registrants?: Array<RegistrantProfileSearchResult>;
}
