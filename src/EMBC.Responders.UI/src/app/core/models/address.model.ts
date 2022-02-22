import { Address } from '../api/models';
import {
  Community,
  Country,
  StateProvince
} from '../services/locations.service';

export interface AddressModel extends Address {
  community: Community | string;
  country: Country;
  stateProvince?: StateProvince;
}
