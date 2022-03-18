/* tslint:disable */
/* eslint-disable */
import { SupportDelivery } from './support-delivery';
import { SupportMethod } from './support-method';
export interface ETransfer extends SupportDelivery {
  method: SupportMethod;
}
