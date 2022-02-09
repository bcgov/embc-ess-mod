/* tslint:disable */
/* eslint-disable */
import { Address } from './address';
import { Support } from './support';
import { SupportMethod } from './support-method';
export interface Referral extends Support {
  issuedToPersonName?: string;
  method?: SupportMethod;
  supplierAddress?: Address;
  supplierId?: string;
  supplierName?: string;
}
