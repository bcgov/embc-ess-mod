/* tslint:disable */
/* eslint-disable */
import { Address } from './address';
import { MutualAid } from './mutual-aid';
import { SupplierStatus } from './supplier-status';
import { SupplierTeamDetails } from './supplier-team-details';
export interface SupplierListItem {
  address?: Address;
  gstNumber?: string;
  id?: string;
  isPrimarySupplier?: boolean;
  legalName?: string;
  mutualAid?: MutualAid;
  name?: string;
  primaryTeams?: Array<SupplierTeamDetails>;
  providesMutualAid?: boolean;
  status?: SupplierStatus;
}
