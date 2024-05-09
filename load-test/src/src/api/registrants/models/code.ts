/* tslint:disable */
/* eslint-disable */
import { CommunityCode } from './community-code';
export interface Code {
  description?: null | string;
  isActive?: boolean;
  parentCode?: null | (Code | CommunityCode);
  type?: null | string;
  value?: null | string;
}
