/* tslint:disable */
/* eslint-disable */
import { Address } from '../models/address';
import { SupportDelivery } from '../models/support-delivery';
import { SupportMethod } from '../models/support-method';
export type Referral = SupportDelivery & {
  manualReferralId?: string | null;
  method: SupportMethod;
  supplierId: string;
  supplierName?: string;
  supplierLegalName?: string;
  supplierAddress?: Address;
  supplierNotes?: string;
  issuedToPersonName: string;
};
