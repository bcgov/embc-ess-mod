/* tslint:disable */
/* eslint-disable */
import { SupportDelivery } from './support-delivery';
import { SupportMethod } from './support-method';
export type ETransfer = SupportDelivery & {
'method': SupportMethod;
};
