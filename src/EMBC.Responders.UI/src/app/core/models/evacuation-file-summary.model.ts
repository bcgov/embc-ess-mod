import { AddressModel } from './address.model';
import { EvacuationFileSummary } from '../api/models/evacuation-file-summary';

export interface EvacuationFileSummaryModel extends EvacuationFileSummary {
  evacuatedFromAddress: AddressModel;
}
