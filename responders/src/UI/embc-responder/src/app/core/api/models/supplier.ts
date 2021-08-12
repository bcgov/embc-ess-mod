/* tslint:disable */
/* eslint-disable */
import { Address } from './address';
import { SupplierContact } from './supplier-contact';
import { SupplierStatus } from './supplier-status';
export interface Supplier {
  address?: null | Address;
  gstNumber?: null | string;
  id?: null | string;
  legalName?: null | string;
  mutualAid?: boolean;
  name?: null | string;
  primaryContact?: null | SupplierContact;
  status?: SupplierStatus;
}
