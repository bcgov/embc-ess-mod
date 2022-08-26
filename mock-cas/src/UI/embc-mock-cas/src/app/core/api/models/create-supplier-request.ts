/* tslint:disable */
/* eslint-disable */
import { Supplieraddress } from './supplieraddress';
export interface CreateSupplierRequest {
  businessNumber?: null | string;
  sin?: null | string;
  subCategory?: string;
  supplierAddress?: Array<Supplieraddress>;
  supplierName?: string;
}
