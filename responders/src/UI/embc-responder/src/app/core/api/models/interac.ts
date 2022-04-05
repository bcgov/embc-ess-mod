/* tslint:disable */
/* eslint-disable */
import { ETransfer } from './e-transfer';
export interface Interac extends ETransfer {
  notificationEmail?: null | string;
  notificationMobile?: null | string;
  receivingRegistrantId: string;
  recipientFirstName?: string;
  recipientLastName?: string;
}
