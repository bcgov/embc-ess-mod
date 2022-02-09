/* tslint:disable */
/* eslint-disable */
import { Address } from './address';
import { SupplierContact } from './supplier-contact';
import { SupplierStatus } from './supplier-status';
import { SupplierTeamDetails } from './supplier-team-details';
export interface Supplier {
  address?: Address;
  contact?: SupplierContact;
  gstNumber?: string;
  id?: null | string;
  legalName?: string;
  name?: null | string;
  sharedWithTeams?: Array<SupplierTeamDetails>;
  status?: SupplierStatus;
  team?: null | SupplierTeamDetails;
}
