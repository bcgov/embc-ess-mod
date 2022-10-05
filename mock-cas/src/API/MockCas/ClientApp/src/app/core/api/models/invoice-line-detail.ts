/* tslint:disable */
/* eslint-disable */
import { Invoice } from './invoice';
export interface InvoiceLineDetail {
  defaultDistributionAccount?: string;
  description?: null | string;
  distributionSupplier?: null | string;
  id?: number;
  info1?: null | string;
  info2?: null | string;
  info3?: null | string;
  invoice?: null | Invoice;
  invoiceLineAmount?: number;
  invoiceLineNumber?: number;
  invoiceLineType?: string;
  lineCode?: string;
  taxClassificationCode?: null | string;
}
