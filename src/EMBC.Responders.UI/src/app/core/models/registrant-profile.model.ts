import { RegistrantProfile } from '../api/models';
import { AddressModel } from './address.model';

export interface RegistrantProfileModel extends RegistrantProfile {
  primaryAddress: AddressModel;
  mailingAddress: AddressModel;
}
