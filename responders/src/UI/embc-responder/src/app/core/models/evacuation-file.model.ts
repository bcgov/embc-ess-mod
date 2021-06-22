import { RegistrantProfile } from '../api/models';
import { EvacuationFile } from '../api/models/evacuation-file';
import { AddressModel } from './address.model';

export interface EvacuationFileModel extends EvacuationFile {
  evacuatedFromAddress: AddressModel;
}
