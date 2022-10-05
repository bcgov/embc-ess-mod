/* tslint:disable */
/* eslint-disable */
import { InvoiceLineDetail } from './invoice-line-detail';
export interface Invoice {
  addressLine1?: null | string;
  addressLine2?: null | string;
  addressLine3?: null | string;
  city?: null | string;
  country?: null | string;
  currencyCode?: string;
  dateGoodsReceived?: null | string;
  dateInvoiceReceived?: string;
  eftAdviceFlag?: null | string;
  glDate?: string;
  id?: number;
  interacEmail?: null | string;
  interacMobileCountryCode?: null | string;
  interacMobileNumber?: null | string;
  invoiceAmount?: number;
  invoiceBatchName?: string;
  invoiceDate?: string;
  invoiceLineDetails?: Array<InvoiceLineDetail>;
  invoiceNumber?: string;
  invoiceType?: string;
  nameLine1?: string;
  nameLine2?: null | string;
  payAloneFlag?: string;
  payGroup?: string;
  paymentAdviceComments?: null | string;
  postalCode?: null | string;
  province?: null | string;
  qualifiedReceiver?: null | string;
  remittanceCode?: string;
  remittanceMessage1?: string;
  remittanceMessage2?: string;
  remittanceMessage3?: null | string;
  specialHandling?: string;
  supplierNumber?: string;
  supplierSiteNumber?: string;
  terms?: string;
}
