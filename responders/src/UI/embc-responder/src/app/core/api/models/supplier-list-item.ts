/* tslint:disable */
/* eslint-disable */
import { Address } from '../models/address';
import { MutualAid } from '../models/mutual-aid';
import { SupplierStatus } from '../models/supplier-status';
import { SupplierTeamDetails } from '../models/supplier-team-details';
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
