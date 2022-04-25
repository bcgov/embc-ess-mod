/* tslint:disable */
/* eslint-disable */
import { Address } from './address';
import { SupportDelivery } from './support-delivery';
import { SupportMethod } from './support-method';
export interface Referral extends SupportDelivery {
  issuedToPersonName: string;
  manualReferralId?: null | string;
  method: SupportMethod;
  supplierAddress?: Address;
  supplierId: string;
  supplierName?: string;
  supplierNotes?: string;
}
