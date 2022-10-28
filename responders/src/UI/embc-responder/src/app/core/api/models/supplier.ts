/* tslint:disable */
/* eslint-disable */
import { Address } from './address';
import { MutualAid } from './mutual-aid';
import { SupplierContact } from './supplier-contact';
import { SupplierStatus } from './supplier-status';
import { SupplierTeamDetails } from './supplier-team-details';
export interface Supplier {
  address?: Address;
  contact?: SupplierContact;
  gstNumber?: string;
  id?: null | string;
  legalName?: string;
  mutualAids?: Array<MutualAid>;
  name?: null | string;
  primaryTeams?: Array<SupplierTeamDetails>;
  status?: SupplierStatus;
}
