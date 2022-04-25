/* tslint:disable */
/* eslint-disable */
import { Support } from './support';
import { SupportCategory } from './support-category';
import { SupportSubCategory } from './support-sub-category';
export interface IncidentalsSupport extends Support {
  approvedItems: string;
  approverName?: string;
  category: SupportCategory;
  subCategory: SupportSubCategory;
  totalAmount: number;
}
