/* tslint:disable */
/* eslint-disable */
import { Address } from '../models/address';
import { SupportDelivery } from '../models/support-delivery';
import { SupportMethod } from '../models/support-method';
export type Referral = SupportDelivery & {
  manualReferralId?: string | null;
  method: SupportMethod;
  supplierId: string;
  supplierName?: string | null;
  supplierLegalName?: string | null;
  supplierAddress?: Address;
  supplierNotes?: string | null;
  issuedToPersonName: string;
};
