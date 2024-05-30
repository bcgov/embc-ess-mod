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
  gstNumber?: string;
  id?: string | null;
  legalName?: string;
  mutualAids?: Array<MutualAid>;
  name?: string | null;
  primaryTeams?: Array<SupplierTeamDetails>;
  status?: SupplierStatus;
}
