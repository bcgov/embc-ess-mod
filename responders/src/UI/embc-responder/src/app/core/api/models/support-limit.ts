/* tslint:disable */
/* eslint-disable */
import { SupportSubCategory } from './support-sub-category';
export interface SupportLimit {
    supportLimitStartDate: Date;
    supportLimitEndDate: Date;
    extensionAvailable: boolean;
    supportType: SupportSubCategory
}
