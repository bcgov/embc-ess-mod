/* tslint:disable */
/* eslint-disable */
import { CommunityCode } from '../models/community-code';
export interface Code {
  description?: string | null;
  isActive?: boolean;
  parentCode?: (Code | CommunityCode) | null;
  type?: string | null;
  value?: string | null;
}
