/* tslint:disable */
/* eslint-disable */
import { Address } from '../models/address';
import { MutualAid } from '../models/mutual-aid';
import { SupplierStatus } from '../models/supplier-status';
import { SupplierTeamDetails } from '../models/supplier-team-details';
export interface SupplierListItem {
  address?: Address;
  gstNumber?: string | null;
  id?: string | null;
  isPrimarySupplier?: boolean;
  legalName?: string | null;
  mutualAid?: MutualAid;
  name?: string | null;
  primaryTeams?: Array<SupplierTeamDetails> | null;
  providesMutualAid?: boolean;
  status?: SupplierStatus;
}
