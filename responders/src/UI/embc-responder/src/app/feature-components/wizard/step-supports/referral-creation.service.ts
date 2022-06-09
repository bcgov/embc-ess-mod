import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  ClothingSupport,
  FoodGroceriesSupport,
  FoodRestaurantSupport,
  IncidentalsSupport,
  LodgingBilletingSupport,
  LodgingGroupSupport,
  LodgingHotelSupport,
  Referral,
  Support,
  SupportCategory,
  SupportSubCategory,
  TransportationOtherSupport,
  TransportationTaxiSupport
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
import {
  Community,
  LocationsService
} from 'src/app/core/services/locations.service';

@Injectable({ providedIn: 'root' })
export class ReferralCreationService {
  private mealReferralVal: FoodRestaurantSupport;
  private groceriesReferralVal: FoodGroceriesSupport;
  private taxiReferralVal: TransportationTaxiSupport;
  private otherReferralVal: TransportationOtherSupport;
  private hotelReferralVal: LodgingHotelSupport;
  private billetingReferralVal: LodgingBilletingSupport;
  private groupReferralVal: LodgingGroupSupport;
  private clothingReferralVal: ClothingSupport;
  private incidentalsReferralVal: IncidentalsSupport;
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

  set groceriesReferral(groceriesReferralVal: FoodGroceriesSupport) {
    this.groceriesReferralVal = groceriesReferralVal;
    this.cacheService.set('groceriesReferral', groceriesReferralVal);
    this.setDraftSupport(groceriesReferralVal);
  }

  get groceriesReferral(): FoodGroceriesSupport {
    return this.groceriesReferralVal
      ? this.groceriesReferralVal
      : JSON.parse(this.cacheService.get('groceriesReferral'));
  }

  set mealReferral(mealReferralVal: FoodRestaurantSupport) {
    this.mealReferralVal = mealReferralVal;
    this.cacheService.set('mealReferral', mealReferralVal);
    this.setDraftSupport(mealReferralVal);
  }

  get mealReferral(): FoodRestaurantSupport {
    return this.mealReferralVal
      ? this.mealReferralVal
      : JSON.parse(this.cacheService.get('mealReferral'));
  }

  set taxiReferral(taxiReferralVal: TransportationTaxiSupport) {
    this.taxiReferralVal = taxiReferralVal;
    this.cacheService.set('taxiReferral', taxiReferralVal);
    this.setDraftSupport(taxiReferralVal);
  }

  get taxiReferral(): TransportationTaxiSupport {
    return this.taxiReferralVal
      ? this.taxiReferralVal
      : JSON.parse(this.cacheService.get('taxiReferral'));
  }

  set otherReferral(otherReferralVal: TransportationOtherSupport) {
    this.otherReferralVal = otherReferralVal;
    this.cacheService.set('otherReferral', otherReferralVal);
    this.setDraftSupport(otherReferralVal);
  }

  get otherReferral(): TransportationOtherSupport {
    return this.otherReferralVal
      ? this.otherReferralVal
      : JSON.parse(this.cacheService.get('otherReferral'));
  }

  set hotelReferral(hotelReferralVal: LodgingHotelSupport) {
    this.hotelReferralVal = hotelReferralVal;
    this.cacheService.set('hotelMotelReferral', hotelReferralVal);
    this.setDraftSupport(hotelReferralVal);
  }

  get hotelReferral(): LodgingHotelSupport {
    return this.hotelReferralVal
      ? this.hotelReferralVal
      : JSON.parse(this.cacheService.get('hotelMotelReferral'));
  }

  set billetingReferral(billetingReferralVal: LodgingBilletingSupport) {
    this.billetingReferralVal = billetingReferralVal;
    this.cacheService.set('billetingReferral', billetingReferralVal);
    this.setDraftSupport(billetingReferralVal);
  }

  get billetingReferral(): LodgingBilletingSupport {
    return this.billetingReferralVal
      ? this.billetingReferralVal
      : JSON.parse(this.cacheService.get('billetingReferral'));
  }

  set groupReferral(groupReferralVal: LodgingGroupSupport) {
    this.groupReferralVal = groupReferralVal;
    this.cacheService.set('groupReferral', groupReferralVal);
    this.setDraftSupport(groupReferralVal);
  }

  get groupReferral(): LodgingGroupSupport {
    return this.groupReferralVal
      ? this.groupReferralVal
      : JSON.parse(this.cacheService.get('groupReferral'));
  }

  set clothingReferral(clothingReferralVal: ClothingSupport) {
    this.clothingReferralVal = clothingReferralVal;
    this.setDraftSupport(clothingReferralVal);
  }

  get clothingReferral(): ClothingSupport {
    return this.clothingReferralVal
      ? this.clothingReferralVal
      : JSON.parse(this.cacheService.get('clothingReferralVal'));
  }

  set incidentalsReferral(incidentalsReferralVal: IncidentalsSupport) {
    this.incidentalsReferralVal = incidentalsReferralVal;
    this.setDraftSupport(incidentalsReferralVal);
  }

  get incidentalsReferral(): IncidentalsSupport {
    return this.incidentalsReferralVal
      ? this.incidentalsReferralVal
      : JSON.parse(this.cacheService.get('incidentalsReferral'));
  }

  createMealReferral(referral: Support, supportDetails: SupportDetailsModel) {
    const mealReferral: FoodRestaurantSupport = {
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
    referral: Support,
    supportDetails: SupportDetailsModel
  ) {
    const groceriesReferral: FoodGroceriesSupport = {
      ...referral,
      category: SupportCategory.Food,
      numberOfDays: (supportDetails.referral as Groceries).noOfMeals,
      subCategory: SupportSubCategory.Food_Groceries,
      totalAmount: this.parseTextNumber(
        (supportDetails.referral as Groceries).userTotalAmount
          ? (supportDetails.referral as Groceries).userTotalAmount
          : (supportDetails.referral as Groceries).totalAmount
      ),
      approverName: (supportDetails.referral as Groceries).approverName
    };
    this.groceriesReferral = groceriesReferral;
  }

  createTaxiReferral(referral: Support, supportDetails: SupportDetailsModel) {
    const taxiReferral: TransportationTaxiSupport = {
      ...referral,
      category: SupportCategory.Transportation,
      fromAddress: (supportDetails.referral as Taxi).fromAddress,
      toAddress: (supportDetails.referral as Taxi).toAddress,
      subCategory: SupportSubCategory.Transportation_Taxi
    };
    this.taxiReferral = taxiReferral;
  }

  createOtherReferral(referral: Support, supportDetails: SupportDetailsModel) {
    const otherReferral: TransportationOtherSupport = {
      ...referral,
      category: SupportCategory.Transportation,
      transportMode: (supportDetails.referral as OtherTransport).transportMode,
      totalAmount: this.parseTextNumber(
        (supportDetails.referral as OtherTransport).totalAmount
      ),
      subCategory: SupportSubCategory.Transportation_Other
    };
    this.otherReferral = otherReferral;
  }

  createHotelMotelReferral(
    referral: Support,
    supportDetails: SupportDetailsModel
  ) {
    const hotelMotelReferral: LodgingHotelSupport = {
      ...referral,
      category: SupportCategory.Lodging,
      numberOfNights: (supportDetails.referral as HotelMotel).noOfNights,
      numberOfRooms: (supportDetails.referral as HotelMotel).noOfRooms,
      subCategory: SupportSubCategory.Lodging_Hotel
    };
    this.hotelReferral = hotelMotelReferral;
  }

  createBilletingReferral(
    referral: Support,
    supportDetails: SupportDetailsModel,
    supportDelivery: SupportDeliveryModel
  ) {
    const billetingReferral: LodgingBilletingSupport = {
      ...referral,
      category: SupportCategory.Lodging,
      numberOfNights: (supportDetails.referral as HotelMotel).noOfNights,
      subCategory: SupportSubCategory.Lodging_Billeting,
      hostName: supportDelivery.details.hostName,
      hostAddress: supportDelivery.details.hostAddress,
      hostCity: supportDelivery.details.hostCity as string,
      hostPhone: supportDelivery.details.hostPhone,
      hostEmail: supportDelivery.details.emailAddress
    };
    this.billetingReferral = billetingReferral;
  }

  createGroupLodgingReferral(
    referral: Support,
    supportDetails: SupportDetailsModel,
    supportDelivery: SupportDeliveryModel
  ) {
    const groupReferral: LodgingGroupSupport = {
      ...referral,
      category: SupportCategory.Lodging,
      numberOfNights: (supportDetails.referral as HotelMotel).noOfNights,
      subCategory: SupportSubCategory.Lodging_Group,
      facilityAddress: supportDelivery.details.hostAddress,
      facilityCity: this.parseCommunityName(
        supportDelivery.details.hostCity as Community
      ),
      facilityCommunityCode: this.parseCommunityCode(
        supportDelivery.details.hostCommunityCode as Community
      ),
      facilityContactPhone: supportDelivery.details.hostPhone,
      facilityName: supportDelivery.details.hostName
    };
    this.groupReferral = groupReferral;
  }

  createClothingReferral(
    referral: Support,
    supportDetails: SupportDetailsModel
  ) {
    const clothingReferral: ClothingSupport = {
      ...referral,
      category: SupportCategory.Clothing,
      extremeWinterConditions: (supportDetails.referral as Clothing)
        .extremeWinterConditions,
      totalAmount: this.parseTextNumber(
        (supportDetails.referral as Clothing).userTotalAmount
          ? (supportDetails.referral as Clothing).userTotalAmount
          : (supportDetails.referral as Clothing).totalAmount
      ),
      approverName: (supportDetails.referral as Groceries).approverName,
      subCategory: SupportSubCategory.None
    };
    this.clothingReferral = clothingReferral;
  }

  createIncidentalsReferral(
    referral: Support,
    supportDetails: SupportDetailsModel
  ) {
    const incidentalsReferral: IncidentalsSupport = {
      ...referral,
      category: SupportCategory.Incidentals,
      approvedItems: (supportDetails.referral as Incidentals).approvedItems,
      totalAmount: this.parseTextNumber(
        (supportDetails.referral as Incidentals).userTotalAmount
          ? (supportDetails.referral as Incidentals).userTotalAmount
          : (supportDetails.referral as Incidentals).totalAmount
      ),
      approverName: (supportDetails.referral as Groceries).approverName,
      subCategory: SupportSubCategory.None
    };
    this.incidentalsReferral = incidentalsReferral;
  }

  clearDraftSupports(supportType: string, support: Support): Observable<void> {
    this.updateDraftSupports(support);
    return of(void 0);
  }

  updateDraftSupports(support: Support) {
    const index = this.draftSupportVal.indexOf(support);
    if (index > -1) {
      this.draftSupportVal.splice(index, 1);
    }
  }

  parseTextNumber(numberInput: string | number): number {
    if (typeof numberInput === 'number') {
      return numberInput;
    } else {
      return parseFloat(numberInput.replace(',', ''));
    }
  }

  parseCommunityName(community: Community): string {
    return community.name;
  }

  parseCommunityCode(community: Community): string {
    return community.code;
  }
}
