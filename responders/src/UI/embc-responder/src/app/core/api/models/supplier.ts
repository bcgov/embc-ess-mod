/* tslint:disable */
/* eslint-disable */
import { Address } from './address';
import { SupplierContact } from './supplier-contact';
import { SupplierStatus } from './supplier-status';
import { Team } from './team';
export interface Supplier {
  address?: null | Address;
  contact?: null | SupplierContact;
  gstNumber?: null | string;
  id?: null | string;
  legalName?: null | string;
  mutualAid?: boolean;
  name?: null | string;
  status?: SupplierStatus;
  supplierId?: null | string;
  team?: null | Team;
}
