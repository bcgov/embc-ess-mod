/* tslint:disable */
/* eslint-disable */
import { SupportDelivery } from '../models/support-delivery';
import { SupportMethod } from '../models/support-method';
export type ETransfer = SupportDelivery & {
  method: SupportMethod;
};
