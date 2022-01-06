/* tslint:disable */
/* eslint-disable */
import { Address } from './address';
import { SupplierStatus } from './supplier-status';
import { SupplierTeamDetails } from './supplier-team-details';
export interface SupplierListItem {
  address?: null | Address;
  gstNumber?: null | string;
  id?: null | string;
  isPrimarySupplier?: boolean;
  legalName?: null | string;
  name?: null | string;
  providesMutualAid?: boolean;
  status?: SupplierStatus;
  team?: null | SupplierTeamDetails;
}
