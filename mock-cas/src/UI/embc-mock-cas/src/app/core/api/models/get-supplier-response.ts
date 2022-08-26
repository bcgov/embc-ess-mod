/* tslint:disable */
/* eslint-disable */
import { Supplieraddress } from './supplieraddress';
export interface GetSupplierResponse {
  businessnumber?: null | string;
  id?: number;
  lastupdated?: null | string;
  providerid?: null | string;
  sin?: null | string;
  standardindustryclassification?: null | string;
  status?: null | string;
  subcategory?: null | string;
  supplieraddress?: Array<Supplieraddress>;
  suppliername?: string;
  suppliernumber?: string;
  supplierprotected?: null | string;
}
