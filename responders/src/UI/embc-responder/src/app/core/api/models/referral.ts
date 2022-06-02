/* tslint:disable */
/* eslint-disable */
import { Address } from './address';
import { SupportDelivery } from './support-delivery';
import { SupportMethod } from './support-method';
export type Referral = SupportDelivery & {
'manualReferralId'?: string | null;
'method': SupportMethod;
'supplierId': string;
'supplierName'?: string;
'supplierLegalName'?: string;
'supplierAddress'?: Address;
'supplierNotes'?: string;
'issuedToPersonName': string;
};
