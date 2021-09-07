import { TestBed } from '@angular/core/testing';
import { EvacuationFileHouseholdMember, Referral } from '../api/models';
import { SupplierListItemModel } from './supplier-list-item.model';

export class SupportDetailsModel {
  fromDate: string;
  fromTime: string;
  noOfDays: string;
  toDate: string;
  toTime: string;
  members: Array<EvacuationFileHouseholdMember>;
  referral: RestaurantMeal | Groceries;
}

export class SupportDeliveryModel {
  issuedTo: string;
  name: string;
  supplier: SupplierListItemModel;
  supplierNote: string;
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
}
