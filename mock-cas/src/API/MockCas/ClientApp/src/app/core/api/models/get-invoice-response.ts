/* tslint:disable */
/* eslint-disable */
import { InvoiceItem } from './invoice-item';
import { PageReference } from './page-reference';
export interface GetInvoiceResponse {
  first?: null | PageReference;
  items?: Array<InvoiceItem>;
  next?: null | PageReference;
}
