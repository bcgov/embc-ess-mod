import { EvacuationFile } from '../api/models/evacuation-file';
import { Community } from '../services/locations.service';
import { AddressModel } from './address.model';

export interface EvacuationFileModel extends EvacuationFile {
  evacuatedFromAddress: AddressModel;
  assignedTaskCommunity?: Community;
}
