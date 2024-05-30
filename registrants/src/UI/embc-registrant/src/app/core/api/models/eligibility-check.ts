/* tslint:disable */
/* eslint-disable */
import { SelfServeSupportSetting } from '../models/self-serve-support-setting';
export interface EligibilityCheck {
  evacuationFileId?: string | null;
  from?: string | null;
  isEligable?: boolean;
  supportSettings?: Array<SelfServeSupportSetting> | null;
  taskNumber?: string | null;
  to?: string | null;
}
