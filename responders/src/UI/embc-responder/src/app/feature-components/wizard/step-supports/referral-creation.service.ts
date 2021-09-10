import { Injectable } from '@angular/core';
import {
  FoodGroceriesReferral,
  FoodRestaurantReferral,
  LodgingBilletingReferral,
  LodgingGroupReferral,
  LodgingHotelReferral,
  Referral,
  SupportCategory,
  SupportSubCategory,
  TransportationOtherReferral,
  TransportationTaxiReferral
} from 'src/app/core/api/models';
import {
  Groceries,
  HotelMotel,
  OtherTransport,
  RestaurantMeal,
  SupportDetailsModel,
  Taxi
} from 'src/app/core/models/support-details.model';
import { CacheService } from 'src/app/core/services/cache.service';
import { LodgingGroupComponent } from '../support-components/support-details/details-type/lodging-group/lodging-group.component';

@Injectable({ providedIn: 'root' })
export class ReferralCreationService {
  constructor(private cacheService: CacheService) {}

  createMealReferral(referral: Referral, supportDetails: SupportDetailsModel) {
    const mealReferral: FoodRestaurantReferral = {
      ...referral,
      category: SupportCategory.Food,
      numberOfBreakfastsPerPerson: (supportDetails.referral as RestaurantMeal)
        .noOfBreakfast,
      numberOfDinnersPerPerson: (supportDetails.referral as RestaurantMeal)
        .noOfDinners,
      numberOfLunchesPerPerson: (supportDetails.referral as RestaurantMeal)
        .noOfLunches,
      subCategory: SupportSubCategory.Food_Restaurant,
      totalAmount: (supportDetails.referral as RestaurantMeal).totalAmount
    };
    this.cacheService.set('mealReferral', mealReferral);
  }

  createGroceriesReferral(
    referral: Referral,
    supportDetails: SupportDetailsModel
  ) {
    const groceriesReferral: FoodGroceriesReferral = {
      ...referral,
      category: SupportCategory.Food,
      numberOfDays: (supportDetails.referral as Groceries).noOfMeals,
      subCategory: SupportSubCategory.Food_Groceries,
      totalAmount: (supportDetails.referral as Groceries).userTotalAmount
        ? (supportDetails.referral as Groceries).userTotalAmount
        : (supportDetails.referral as Groceries).totalAmount
    };
    this.cacheService.set('groceriesReferral', groceriesReferral);
  }

  createTaxiReferral(referral: Referral, supportDetails: SupportDetailsModel) {
    const taxiReferral: TransportationTaxiReferral = {
      ...referral,
      category: SupportCategory.Transportation,
      fromAddress: (supportDetails.referral as Taxi).fromAddress,
      toAddress: (supportDetails.referral as Taxi).toAddress,
      subCategory: SupportSubCategory.Transportation_Taxi
    };
    this.cacheService.set('taxiReferral', taxiReferral);
  }

  createOtherReferral(referral: Referral, supportDetails: SupportDetailsModel) {
    const otherReferral: TransportationOtherReferral = {
      ...referral,
      category: SupportCategory.Transportation,
      transportMode: (supportDetails.referral as OtherTransport).transportMode,
      totalAmount: (supportDetails.referral as OtherTransport).totalAmount,
      subCategory: SupportSubCategory.Transportation_Other
    };
    this.cacheService.set('taxiReferral', otherReferral);
  }

  createHotelMotelReferral(
    referral: Referral,
    supportDetails: SupportDetailsModel
  ) {
    const hotelMotelReferral: LodgingHotelReferral = {
      ...referral,
      category: SupportCategory.Lodging,
      numberOfNights: (supportDetails.referral as HotelMotel).noOfNights,
      numberOfRooms: (supportDetails.referral as HotelMotel).noOfRooms,
      subCategory: SupportSubCategory.Lodging_Hotel
    };
    this.cacheService.set('hotelMotelReferral', hotelMotelReferral);
  }

  createBilletingReferral(
    referral: Referral,
    supportDetails: SupportDetailsModel
  ) {
    const billetingReferral: LodgingBilletingReferral = {
      ...referral,
      category: SupportCategory.Lodging,
      numberOfNights: (supportDetails.referral as HotelMotel).noOfNights,
      subCategory: SupportSubCategory.Lodging_Billeting
    };
    this.cacheService.set('billetingReferral', billetingReferral);
  }

  createGroupLodgingReferral(
    referral: Referral,
    supportDetails: SupportDetailsModel
  ) {
    const groupReferral: LodgingGroupReferral = {
      ...referral,
      category: SupportCategory.Lodging,
      numberOfNights: (supportDetails.referral as HotelMotel).noOfNights,
      subCategory: SupportSubCategory.Lodging_Group
    };
    this.cacheService.set('groupReferral', groupReferral);
  }
}
