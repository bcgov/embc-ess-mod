import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  ClothingReferral,
  FoodGroceriesReferral,
  FoodRestaurantReferral,
  IncidentalsReferral,
  LodgingBilletingReferral,
  LodgingGroupReferral,
  LodgingHotelReferral,
  Referral,
  Support,
  SupportCategory,
  SupportSubCategory,
  TransportationOtherReferral,
  TransportationTaxiReferral
} from 'src/app/core/api/models';
import {
  Clothing,
  Groceries,
  HotelMotel,
  Incidentals,
  OtherTransport,
  RestaurantMeal,
  SupportDeliveryModel,
  SupportDetailsModel,
  Taxi
} from 'src/app/core/models/support-details.model';
import { CacheService } from 'src/app/core/services/cache.service';

@Injectable({ providedIn: 'root' })
export class ReferralCreationService {
  private mealReferralVal: FoodRestaurantReferral;
  private groceriesReferralVal: FoodGroceriesReferral;
  private taxiReferralVal: TransportationTaxiReferral;
  private otherReferralVal: TransportationOtherReferral;
  private hotelReferralVal: LodgingHotelReferral;
  private billetingReferralVal: LodgingBilletingReferral;
  private groupReferralVal: LodgingGroupReferral;
  private clothingReferralVal: ClothingReferral;
  private incidentalsReferralVal: IncidentalsReferral;
  private draftSupportVal: Support[] = [];

  constructor(private cacheService: CacheService) {}

  setDraftSupport(draftSupportVal: Support) {
    if (draftSupportVal !== null) {
      this.draftSupportVal.push(draftSupportVal);
    }
  }

  getDraftSupport(): Support[] {
    return this.draftSupportVal;
  }

  clearDraftSupport(): void {
    this.draftSupportVal = [];
  }

  set groceriesReferral(groceriesReferralVal: FoodGroceriesReferral) {
    this.groceriesReferralVal = groceriesReferralVal;
    this.cacheService.set('groceriesReferral', groceriesReferralVal);
    this.setDraftSupport(groceriesReferralVal);
  }

  get groceriesReferral(): FoodGroceriesReferral {
    return this.groceriesReferralVal
      ? this.groceriesReferralVal
      : JSON.parse(this.cacheService.get('groceriesReferral'));
  }

  set mealReferral(mealReferralVal: FoodRestaurantReferral) {
    this.mealReferralVal = mealReferralVal;
    this.cacheService.set('mealReferral', mealReferralVal);
    this.setDraftSupport(mealReferralVal);
  }

  get mealReferral(): FoodRestaurantReferral {
    return this.mealReferralVal
      ? this.mealReferralVal
      : JSON.parse(this.cacheService.get('mealReferral'));
  }

  set taxiReferral(taxiReferralVal: TransportationTaxiReferral) {
    this.taxiReferralVal = taxiReferralVal;
    this.cacheService.set('taxiReferral', taxiReferralVal);
    this.setDraftSupport(taxiReferralVal);
  }

  get taxiReferral(): TransportationTaxiReferral {
    return this.taxiReferralVal
      ? this.taxiReferralVal
      : JSON.parse(this.cacheService.get('taxiReferral'));
  }

  set otherReferral(otherReferralVal: TransportationOtherReferral) {
    this.otherReferralVal = otherReferralVal;
    this.cacheService.set('otherReferral', otherReferralVal);
    this.setDraftSupport(otherReferralVal);
  }

  get otherReferral(): TransportationOtherReferral {
    return this.otherReferralVal
      ? this.otherReferralVal
      : JSON.parse(this.cacheService.get('otherReferral'));
  }

  set hotelReferral(hotelReferralVal: LodgingHotelReferral) {
    this.hotelReferralVal = hotelReferralVal;
    this.cacheService.set('hotelMotelReferral', hotelReferralVal);
    this.setDraftSupport(hotelReferralVal);
  }

  get hotelReferral(): LodgingHotelReferral {
    return this.hotelReferralVal
      ? this.hotelReferralVal
      : JSON.parse(this.cacheService.get('hotelMotelReferral'));
  }

  set billetingReferral(billetingReferralVal: LodgingBilletingReferral) {
    this.billetingReferralVal = billetingReferralVal;
    this.cacheService.set('billetingReferral', billetingReferralVal);
    this.setDraftSupport(billetingReferralVal);
  }

  get billetingReferral(): LodgingBilletingReferral {
    return this.billetingReferralVal
      ? this.billetingReferralVal
      : JSON.parse(this.cacheService.get('billetingReferral'));
  }

  set groupReferral(groupReferralVal: LodgingGroupReferral) {
    this.groupReferralVal = groupReferralVal;
    this.cacheService.set('groupReferral', groupReferralVal);
    this.setDraftSupport(groupReferralVal);
  }

  get groupReferral(): LodgingGroupReferral {
    return this.groupReferralVal
      ? this.groupReferralVal
      : JSON.parse(this.cacheService.get('groupReferral'));
  }

  set clothingReferral(clothingReferralVal: ClothingReferral) {
    this.clothingReferralVal = clothingReferralVal;
    this.setDraftSupport(clothingReferralVal);
  }

  get clothingReferral(): ClothingReferral {
    return this.clothingReferralVal
      ? this.clothingReferralVal
      : JSON.parse(this.cacheService.get('clothingReferralVal'));
  }

  set incidentalsReferral(incidentalsReferralVal: IncidentalsReferral) {
    this.incidentalsReferralVal = incidentalsReferralVal;
    this.setDraftSupport(incidentalsReferralVal);
  }

  get incidentalsReferral(): IncidentalsReferral {
    return this.incidentalsReferralVal
      ? this.incidentalsReferralVal
      : JSON.parse(this.cacheService.get('incidentalsReferral'));
  }

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
    this.mealReferral = mealReferral;
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
    this.groceriesReferral = groceriesReferral;
  }

  createTaxiReferral(referral: Referral, supportDetails: SupportDetailsModel) {
    const taxiReferral: TransportationTaxiReferral = {
      ...referral,
      category: SupportCategory.Transportation,
      fromAddress: (supportDetails.referral as Taxi).fromAddress,
      toAddress: (supportDetails.referral as Taxi).toAddress,
      subCategory: SupportSubCategory.Transportation_Taxi
    };
    this.taxiReferral = taxiReferral;
  }

  createOtherReferral(referral: Referral, supportDetails: SupportDetailsModel) {
    const otherReferral: TransportationOtherReferral = {
      ...referral,
      category: SupportCategory.Transportation,
      transportMode: (supportDetails.referral as OtherTransport).transportMode,
      totalAmount: (supportDetails.referral as OtherTransport).totalAmount,
      subCategory: SupportSubCategory.Transportation_Other
    };
    this.otherReferral = otherReferral;
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
    this.hotelReferral = hotelMotelReferral;
  }

  createBilletingReferral(
    referral: Referral,
    supportDetails: SupportDetailsModel,
    supportDelivery: SupportDeliveryModel
  ) {
    const billetingReferral: LodgingBilletingReferral = {
      ...referral,
      category: SupportCategory.Lodging,
      numberOfNights: (supportDetails.referral as HotelMotel).noOfNights,
      subCategory: SupportSubCategory.Lodging_Billeting,
      hostAddress: supportDelivery.details.hostAddress,
      hostCity: supportDelivery.details.hostCity,
      hostEmail: supportDelivery.details.emailAddress,
      hostName: supportDelivery.details.hostName,
      hostPhone: supportDelivery.details.hostPhone
    };
    this.billetingReferral = billetingReferral;
  }

  createGroupLodgingReferral(
    referral: Referral,
    supportDetails: SupportDetailsModel,
    supportDelivery: SupportDeliveryModel
  ) {
    const groupReferral: LodgingGroupReferral = {
      ...referral,
      category: SupportCategory.Lodging,
      numberOfNights: (supportDetails.referral as HotelMotel).noOfNights,
      subCategory: SupportSubCategory.Lodging_Group,
      facilityAddress: supportDelivery.details.hostAddress,
      facilityCity: supportDelivery.details.hostCity,
      facilityContactPhone: supportDelivery.details.hostPhone,
      facilityName: supportDelivery.details.hostName
    };
    this.groupReferral = groupReferral;
  }

  createClothingReferral(
    referral: Referral,
    supportDetails: SupportDetailsModel
  ) {
    const clothingReferral: ClothingReferral = {
      ...referral,
      category: SupportCategory.Clothing,
      extremeWinterConditions: (supportDetails.referral as Clothing)
        .extremeWinterConditions,
      totalAmount: (supportDetails.referral as Clothing).totalAmount,
      subCategory: null
    };
    this.clothingReferral = clothingReferral;
  }

  createIncidentalsReferral(
    referral: Referral,
    supportDetails: SupportDetailsModel
  ) {
    const incidentalsReferral: IncidentalsReferral = {
      ...referral,
      category: SupportCategory.Incidentals,
      approvedItems: (supportDetails.referral as Incidentals).approvedItems,
      totalAmount: (supportDetails.referral as Incidentals).totalAmount,
      subCategory: null
    };
    this.incidentalsReferral = incidentalsReferral;
  }

  clearDraftSupports(supportType: string, support: Support): Observable<void> {
    this.updateDraftSupports(support);
    // if (supportType === SupportSubCategory.Food_Restaurant) {
    //   //this.cacheService.remove('mealReferral');
    //   this.updateDraftSupports(support);
    //   //this.mealReferral = null;
    // } else if (supportType === SupportSubCategory.Food_Groceries) {
    //   this.cacheService.remove('groceriesReferral');
    //   this.groceriesReferral = null;
    // } else if (supportType === SupportSubCategory.Transportation_Taxi) {
    //   this.cacheService.remove('taxiReferral');
    //   this.taxiReferral = null;
    // } else if (supportType === SupportSubCategory.Transportation_Other) {
    //   this.cacheService.remove('otherReferral');
    //   this.otherReferral = null;
    // } else if (supportType === SupportSubCategory.Lodging_Billeting) {
    //   this.cacheService.remove('billetingReferral');
    //   this.billetingReferral = null;
    // } else if (supportType === SupportSubCategory.Lodging_Hotel) {
    //   this.cacheService.remove('hotelMotelReferral');
    //   this.hotelReferral = null;
    // } else if (supportType === SupportCategory.Incidentals) {
    //   this.cacheService.remove('incidentalsReferral');
    //   this.incidentalsReferral = null;
    // } else if (supportType === SupportCategory.Clothing) {
    //   this.cacheService.remove('clothingReferralVal');
    //   this.clothingReferral = null;
    // } else if (supportType === SupportSubCategory.Lodging_Group) {
    //   this.cacheService.remove('groupReferral');
    //   this.groupReferral = null;
    // }
    return of(void 0);
  }

  updateDraftSupports(support: Support) {
    const index = this.draftSupportVal.indexOf(support);
    console.log(index);
    if (index > -1) {
      this.draftSupportVal.splice(index, 1);
    }
  }
}
