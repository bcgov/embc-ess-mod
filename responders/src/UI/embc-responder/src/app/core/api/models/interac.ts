/* tslint:disable */
/* eslint-disable */
import { ETransfer } from '../models/e-transfer';
export type Interac = ETransfer & {
  receivingRegistrantId: string;
  recipientFirstName?: string | null;
  recipientLastName?: string | null;
  notificationEmail?: string | null;
  notificationMobile?: string | null;
};
