/* tslint:disable */
/* eslint-disable */
import { Address } from '../models/address';
import { MutualAid } from '../models/mutual-aid';
import { SupplierContact } from '../models/supplier-contact';
import { SupplierStatus } from '../models/supplier-status';
import { SupplierTeamDetails } from '../models/supplier-team-details';
export interface Supplier {
  address?: Address;
  contact?: SupplierContact;
  gstNumber?: string | null;
  id?: string | null;
  legalName?: string | null;
  mutualAids?: Array<MutualAid> | null;
  name?: string | null;
  primaryTeams?: Array<SupplierTeamDetails> | null;
  status?: SupplierStatus;
}
