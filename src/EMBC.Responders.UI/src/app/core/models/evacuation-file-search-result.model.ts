import { AddressModel } from './address.model';
import { EvacuationFileSearchResult } from '../api/models';

export interface EvacuationFileSearchResultModel
  extends EvacuationFileSearchResult {
  evacuatedFromAddress: AddressModel;
}
