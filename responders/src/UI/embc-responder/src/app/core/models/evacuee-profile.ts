import { RegistrantProfile } from '../api/models';
import { AddressModel } from './address.model';

export interface EvacueeProfile extends RegistrantProfile {
  primaryAddress: AddressModel;
  mailingAddress: AddressModel;
}
