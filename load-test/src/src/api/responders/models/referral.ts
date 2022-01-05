/* tslint:disable */
/* eslint-disable */
import { Address } from './address';
import { Support } from './support';
import { SupportMethod } from './support-method';
export interface Referral extends Support {
  issuedToPersonName: string;
  method: SupportMethod;
  supplierAddress?: null | Address;
  supplierId: string;
  supplierName?: null | string;
  supplierNotes?: null | string;
}
