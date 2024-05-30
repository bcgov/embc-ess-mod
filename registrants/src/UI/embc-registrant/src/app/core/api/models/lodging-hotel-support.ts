/* tslint:disable */
/* eslint-disable */
import { Support } from '../models/support';
import { SupportCategory } from '../models/support-category';
import { SupportSubCategory } from '../models/support-sub-category';
export type LodgingHotelSupport = Support & {
  category?: SupportCategory;
  subCategory?: SupportSubCategory;
  numberOfNights?: number;
  numberOfRooms?: number;
};
