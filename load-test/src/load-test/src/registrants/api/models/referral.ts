/* tslint:disable */
/* eslint-disable */
import { Address } from './address';
import { Support } from './support';
import { SupportMethod } from './support-method';
export interface Referral extends Support {
  issuedToPersonName?: null | string;
  method?: SupportMethod;
  supplierAddress?: null | Address;
  supplierId?: null | string;
  supplierName?: null | string;
}
