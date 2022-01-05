/* tslint:disable */
/* eslint-disable */
import { Address } from './address';
import { SupplierContact } from './supplier-contact';
import { SupplierStatus } from './supplier-status';
import { SupplierTeamDetails } from './supplier-team-details';
export interface Supplier {
  address?: null | Address;
  contact?: null | SupplierContact;
  gstNumber?: null | string;
  id?: null | string;
  legalName?: null | string;
  name?: null | string;
  sharedWithTeams?: null | Array<SupplierTeamDetails>;
  status?: SupplierStatus;
  team?: null | SupplierTeamDetails;
}
