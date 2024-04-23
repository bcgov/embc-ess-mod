/* tslint:disable */
/* eslint-disable */
import { ETransferDetails } from './e-transfer-details';
import { SelfServeSupport } from './self-serve-support';
export interface SubmitSupportsRequest {
  eTransferDetails?: ETransferDetails;
  fileReferenceNumber?: string;
  supports?: Array<SelfServeSupport>;
}
