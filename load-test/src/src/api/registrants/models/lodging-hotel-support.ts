/* tslint:disable */
/* eslint-disable */
import { Support } from './support';
import { SupportCategory } from './support-category';
import { SupportSubCategory } from './support-sub-category';
export interface LodgingHotelSupport extends Support {
  category?: SupportCategory;
  numberOfNights?: number;
  numberOfRooms?: number;
  subCategory?: SupportSubCategory;
}
