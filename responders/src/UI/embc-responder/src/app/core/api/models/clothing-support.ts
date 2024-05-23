/* tslint:disable */
/* eslint-disable */
import { Support } from '../models/support';
import { SupportCategory } from '../models/support-category';
import { SupportSubCategory } from '../models/support-sub-category';
export type ClothingSupport = Support & {
  extremeWinterConditions?: boolean;
  category: SupportCategory;
  subCategory: SupportSubCategory;
  totalAmount: number;
  approverName?: string;
};
