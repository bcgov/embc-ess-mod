import { EvacuationFileHouseholdMember, SupportMethod } from '../api/models';
import { Community } from '../services/locations.service';
import { SupplierListItemModel } from './supplier-list-item.model';

export class SupportDetailsModel {
  externalReferenceId?: string;
  issuedBy?: string;
  issuedOn?: string;
  fromDate: string;
  fromTime: string;
  noOfDays: number;
  toDate: string;
  toTime: string;
  members: Array<EvacuationFileHouseholdMember>;
  referral:
    | RestaurantMeal
    | Groceries
    | Taxi
    | OtherTransport
    | Billeting
    | GroupLodging
    | HotelMotel
    | Incidentals
    | Clothing;
}

export class SupportDeliveryModel {
  issuedTo: EvacuationFileHouseholdMember;
  name: string;
  supplier: SupplierListItemModel;
  supplierNote: string;
  details?: SupplierDetailsModel;
  method: SupportMethod;
  notificationEmail?: string;
  notificationMobile?: string;
}

export class SupplierDetailsModel {
  hostName?: string;
  hostAddress?: string;
  hostCity?: string | Community;
  hostCommunityCode?: string | Community;
  hostPhone?: string;
  emailAddress?: string;
}

export class RestaurantMeal {
  noOfBreakfast: number;
  noOfLunches: number;
  noOfDinners: number;
  totalAmount: number;
}

export class Groceries {
  noOfMeals: number;
  totalAmount: number;
  userTotalAmount: number;
  approverName: string;
}

export class Taxi {
  fromAddress: string;
  toAddress: string;
}

export class OtherTransport {
  transportMode: string;
  totalAmount: number;
}

export class HotelMotel {
  noOfNights: number;
  noOfRooms: number;
}

export class Billeting {
  noOfNights: number;
}

export class GroupLodging {
  noOfNights: number;
}

export class Incidentals {
  approvedItems: string;
  totalAmount: number;
  userTotalAmount: number;
  approverName: string;
}

export class Clothing {
  extremeWinterConditions: boolean;
  totalAmount: number;
  userTotalAmount: number;
  approverName: string;
}
