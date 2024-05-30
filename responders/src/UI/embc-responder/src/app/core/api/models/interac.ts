/* tslint:disable */
/* eslint-disable */
import { ETransfer } from '../models/e-transfer';
export type Interac = ETransfer & {
  receivingRegistrantId: string;
  recipientFirstName?: string;
  recipientLastName?: string;
  notificationEmail?: string | null;
  notificationMobile?: string | null;
};
