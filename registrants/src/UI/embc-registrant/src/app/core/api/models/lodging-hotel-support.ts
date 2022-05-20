/* tslint:disable */
/* eslint-disable */
import { Support } from './support';
import { SupportCategory } from './support-category';
import { SupportSubCategory } from './support-sub-category';
export type LodgingHotelSupport = Support & {
'category'?: SupportCategory;
'subCategory'?: SupportSubCategory;
'numberOfNights'?: number;
'numberOfRooms'?: number;
};
