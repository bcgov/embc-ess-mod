import { EvacuationFile } from '../api/models';
import { RegAddress } from './address';

export interface EvacuationFileModel extends EvacuationFile {
  evacuatedAddress: RegAddress;
}
