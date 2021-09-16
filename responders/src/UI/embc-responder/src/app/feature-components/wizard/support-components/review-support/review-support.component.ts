import { Component, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Router } from '@angular/router';
import { last } from 'rxjs/operators';
import {
  FoodGroceriesReferral,
  FoodRestaurantReferral,
  TransportationTaxiReferral,
  TransportationOtherReferral,
  LodgingHotelReferral,
  LodgingBilletingReferral,
  LodgingGroupReferral,
  IncidentalsReferral,
  ClothingReferral,
  Referral,
  Support,
  SupportCategory,
  SupportSubCategory,
  SupportMethod,
  ReferralServices
} from 'src/app/core/api/models';
import { AddressModel } from 'src/app/core/models/address.model';
import { LocationsService } from 'src/app/core/services/locations.service';
import * as globalConst from '../../../../core/services/global-constants';
import { ReferralCreationService } from '../../step-supports/referral-creation.service';
import { StepSupportsService } from '../../step-supports/step-supports.service';

@Component({
  selector: 'app-review-support',
  templateUrl: './review-support.component.html',
  styleUrls: ['./review-support.component.scss']
})
export class ReviewSupportComponent implements OnInit {
  certificationAccepted = false;
  draftSupports: Support[] = [];

  constructor(
    private router: Router,
    private locationService: LocationsService,
    private referralService: ReferralCreationService,
    private stepSupportsService: StepSupportsService
  ) {}

  ngOnInit(): void {
    console.log(this.referralService.getDraftSupport());
    this.draftSupports = this.referralService.getDraftSupport();
  }

  back() {
    this.router.navigate(['/ess-wizard/add-supports/view']);
  }

  certificationChangeEvent(event: MatCheckboxChange): void {
    this.certificationAccepted = event.checked;
  }

  checkGroceryMaxRate(support: Support): boolean {
    const maxRate =
      globalConst.groceriesRate.rate *
      (support as FoodGroceriesReferral).numberOfDays;
    return maxRate < (support as FoodGroceriesReferral).totalAmount
      ? false
      : true;
  }

  // checkMealsMaxRate(support: Support): boolean {
  //   const maxRate =
  //     globalConst.mealRate.rate *
  //     (support as FoodGroceriesReferral).numberOfDays;
  //   return maxRate < (support as FoodGroceriesReferral).totalAmount
  //     ? false
  //     : true;
  // }

  checkIncidentalMaxRate(support: Support): boolean {
    const maxRate =
      globalConst.incidentals.rate *
      (support as IncidentalsReferral).includedHouseholdMembers.length;
    return maxRate < (support as IncidentalsReferral).totalAmount
      ? false
      : true;
  }

  checkClothingMaxRate(support: Support): boolean {
    const rate = (support as ClothingReferral).extremeWinterConditions
      ? globalConst.extremeConditions.rate
      : globalConst.normalConditions.rate;
    const maxRate =
      rate * (support as ClothingReferral).includedHouseholdMembers.length;
    return maxRate < (support as IncidentalsReferral).totalAmount
      ? false
      : true;
  }

  getGroceryReferral(support: Support): FoodGroceriesReferral {
    return support as FoodGroceriesReferral;
  }

  getMealReferral(support: Support): FoodRestaurantReferral {
    return support as FoodRestaurantReferral;
  }

  getTaxiReferral(support: Support): TransportationTaxiReferral {
    return support as TransportationTaxiReferral;
  }

  getOtherReferral(support: Support): TransportationOtherReferral {
    return support as TransportationOtherReferral;
  }

  getHotelReferral(support: Support): LodgingHotelReferral {
    return support as LodgingHotelReferral;
  }

  getBilletingReferral(support: Support): LodgingBilletingReferral {
    return support as LodgingBilletingReferral;
  }

  getGroupReferral(support: Support): LodgingGroupReferral {
    return support as LodgingGroupReferral;
  }

  getIncidentalReferral(support: Support): IncidentalsReferral {
    return support as IncidentalsReferral;
  }

  getClothingReferral(support: Support): ClothingReferral {
    return support as ClothingReferral;
  }

  getReferral(support: Support): Referral {
    return support as Referral;
  }

  getSupplierAddress(support: Support): AddressModel {
    const referral = support as Referral;
    return this.locationService.getAddressModelFromAddress(
      referral?.supplierAddress
    );
    // return referral?.supplierAddress as AddressModel;
  }

  getMemberFullName(memberId: string): string {
    const lastName = this.stepSupportsService.evacFile.needsAssessment.householdMembers.find(
      (member) => member.id === memberId
    ).lastName;
    const firstName = this.stepSupportsService.evacFile.needsAssessment.householdMembers.find(
      (member) => member.id === memberId
    ).firstName;

    return lastName.toUpperCase() + ', ' + firstName;
  }
}
