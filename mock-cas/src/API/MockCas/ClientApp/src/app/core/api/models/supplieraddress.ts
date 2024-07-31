/* tslint:disable */
/* eslint-disable */
import { GetSupplierResponse } from './get-supplier-response';
export interface Supplieraddress {
  accountNumber?: null | string;
  addressLine1?: null | string;
  addressLine2?: null | string;
  addressLine3?: null | string;
  bankNumber?: null | string;
  branchNumber?: null | string;
  city?: null | string;
  country?: null | string;
  eftAdvicePref?: null | string;
  emailAddress?: null | string;
  id?: number;
  lastUpdated?: null | string;
  postalCode?: null | string;
  providerId?: null | string;
  province?: null | string;
  siteProtected?: null | string;
  status?: null | string;
  supplier?: null | GetSupplierResponse;
  suppliersitecode?: string;
}
