import { Component, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Router } from '@angular/router';
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
  Support
} from 'src/app/core/api/models';
import { AddressModel } from 'src/app/core/models/address.model';
import { LocationsService } from 'src/app/core/services/locations.service';
import * as globalConst from '../../../../core/services/global-constants';
import { ReferralCreationService } from '../../step-supports/referral-creation.service';
import { StepSupportsService } from '../../step-supports/step-supports.service';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { ProcessSupportsDialogComponent } from 'src/app/shared/components/dialog-components/process-supports-dialog/process-supports-dialog.component';
import { ReviewSupportService } from './review-support.service';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-review-support',
  templateUrl: './review-support.component.html',
  styleUrls: ['./review-support.component.scss']
})
export class ReviewSupportComponent implements OnInit {
  certificationAccepted = false;
  showErrorMsg = false;
  draftSupports: Support[] = [];
  showLoader = false;

  constructor(
    private router: Router,
    private locationService: LocationsService,
    private referralService: ReferralCreationService,
    private stepSupportsService: StepSupportsService,
    private reviewSupportService: ReviewSupportService,
    private stepSupportsServices: StepSupportsService,
    private alertService: AlertService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    console.log(this.referralService.getDraftSupport());
    this.draftSupports = this.referralService.getDraftSupport();
  }

  /**
   * Goes back to referral list view
   */
  back() {
    this.router.navigate(['/ess-wizard/add-supports/view']);
  }

  /**
   * Listens to changes on the certificationAccepted check box
   *
   * @param event checkbox event
   */
  certificationChangeEvent(event: MatCheckboxChange): void {
    this.certificationAccepted = event.checked;
  }

  /**
   * Calculates if the current support surpass the maximum rate allowed
   *
   * @param support the support to check grocery max rate
   * @returns if the current support surpasses the max rate allow or not
   */
  checkGroceryMaxRate(support: Support): boolean {
    const maxRate =
      globalConst.groceriesRate.rate *
      (support as FoodGroceriesReferral).numberOfDays *
      (support as FoodGroceriesReferral).includedHouseholdMembers.length;
    return maxRate < (support as FoodGroceriesReferral).totalAmount
      ? false
      : true;
  }

  /**
   * Calculates if the current support surpass the maximum rate allowed
   *
   * @param support the support to check grocery max rate
   * @returns if the current support surpasses the max rate allow or not
   */
  checkIncidentalMaxRate(support: Support): boolean {
    const maxRate =
      globalConst.incidentals.rate *
      (support as IncidentalsReferral).includedHouseholdMembers.length;
    return maxRate < (support as IncidentalsReferral).totalAmount
      ? false
      : true;
  }

  /**
   * Calculates if the current support surpass the maximum rate allowed
   *
   * @param support the support to check grocery max rate
   * @returns if the current support surpasses the max rate allow or not
   */
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

  /**
   * Returns the current support as a FoodGroceriesReferral
   *
   * @param support the support to cast as FoodGroceriesReferral
   * @returns a FoodGroceriesReferral object
   */
  getGroceryReferral(support: Support): FoodGroceriesReferral {
    return support as FoodGroceriesReferral;
  }

  /**
   * Returns the current support as a FoodRestaurantReferral
   *
   * @param support the support to cast as FoodRestaurantReferral
   * @returns a FoodRestaurantReferral object
   */
  getMealReferral(support: Support): FoodRestaurantReferral {
    return support as FoodRestaurantReferral;
  }

  /**
   * Returns the current support as a TransportationTaxiReferral
   *
   * @param support the support to cast as TransportationTaxiReferral
   * @returns a TransportationTaxiReferral object
   */
  getTaxiReferral(support: Support): TransportationTaxiReferral {
    return support as TransportationTaxiReferral;
  }

  /**
   * Returns the current support as a TransportationOtherReferral
   *
   * @param support the support to cast as TransportationOtherReferral
   * @returns a TransportationOtherReferral object
   */
  getOtherReferral(support: Support): TransportationOtherReferral {
    return support as TransportationOtherReferral;
  }

  /**
   * Returns the current support as a LodgingHotelReferral
   *
   * @param support the support to cast as LodgingHotelReferral
   * @returns a LodgingHotelReferral object
   */
  getHotelReferral(support: Support): LodgingHotelReferral {
    return support as LodgingHotelReferral;
  }

  /**
   * Returns the current support as a LodgingBilletingReferral
   *
   * @param support the support to cast as LodgingBilletingReferral
   * @returns a LodgingBilletingReferral object
   */
  getBilletingReferral(support: Support): LodgingBilletingReferral {
    return support as LodgingBilletingReferral;
  }

  /**
   * Returns the current support as a LodgingGroupReferral
   *
   * @param support the support to cast as LodgingGroupReferral
   * @returns a LodgingGroupReferral object
   */
  getGroupReferral(support: Support): LodgingGroupReferral {
    return support as LodgingGroupReferral;
  }

  /**
   * Returns the current support as a IncidentalsReferral
   *
   * @param support the support to cast as IncidentalsReferral
   * @returns a IncidentalsReferral object
   */
  getIncidentalReferral(support: Support): IncidentalsReferral {
    return support as IncidentalsReferral;
  }

  /**
   * Returns the current support as a ClothingReferral
   *
   * @param support the support to cast as ClothingReferral
   * @returns a ClothingReferral object
   */
  getClothingReferral(support: Support): ClothingReferral {
    return support as ClothingReferral;
  }

  /**
   * Returns the current support as a Referral
   *
   * @param support the support to cast as Referral
   * @returns a Referral object
   */
  getReferral(support: Support): Referral {
    return support as Referral;
  }

  /**
   * Returns the current support Address as a AddressModel
   *
   * @param support the support's Address to cast as AddressModel
   * @returns a AddressModel object
   */
  getSupplierAddress(support: Support): AddressModel {
    const referral = support as Referral;
    return this.locationService.getAddressModelFromAddress(
      referral?.supplierAddress
    );
    // return referral?.supplierAddress as AddressModel;
  }

  /**
   * Returns the full name of the igiven householmember ID
   *
   * @param memberId the member ID
   * @returns the Full LAST NAME, First Name of the given household member ID
   */
  getMemberFullName(memberId: string): string {
    const lastName =
      this.stepSupportsService.evacFile.needsAssessment.householdMembers.find(
        (member) => member.id === memberId
      ).lastName;
    const firstName =
      this.stepSupportsService.evacFile.needsAssessment.householdMembers.find(
        (member) => member.id === memberId
      ).firstName;

    return lastName.toUpperCase() + ', ' + firstName;
  }

  /**
   * Checks if the given date is in the past
   *
   * @param referralDate the date to compare with the Current Date
   * @returns if the given date is in the past or not
   */
  validReferralDate(fromDate: string, toDate: string): boolean {
    if (moment(toDate).isBefore(fromDate)) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * Process the supports drafts and sends them to the API or verifies that the certification checkbox has been checked before proceed.
   */
  processReferralDraft(): void {
    if (!this.certificationAccepted) {
      this.showErrorMsg = true;
    } else {
      this.showErrorMsg = false;
      this.dialog
        .open(DialogComponent, {
          data: {
            component: ProcessSupportsDialogComponent
          },
          height: '400px',
          width: '630px'
        })
        .afterClosed()
        .subscribe((value) => {
          if (value === 'confirm') {
            this.processDraftSupports();
          }
        });
    }
  }

  private processDraftSupports(): void {
    this.showLoader = !this.showLoader;
    const win = window.open('', '_blank');
    win.document.write('Loading Referral document ... ');
    const supportsDraft: Support[] = this.referralService.getDraftSupport();
    const fileId: string = this.stepSupportsServices.evacFile.id;
    this.reviewSupportService.processSupports(fileId, supportsDraft).subscribe(
      (response) => {
        // Displaying PDF into a new browser tab:
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        win.location.href = url;

        //Clearing Draft supports array and updating the supports list for the selected ESS File
        this.referralService.clearDraftSupport();
        this.reviewSupportService.updateExistingSupportsList();
        this.showLoader = !this.showLoader;
        this.router.navigate(['/ess-wizard/add-supports']);
      },
      (error) => {
        this.showLoader = !this.showLoader;
        this.alertService.clearAlert();
        this.alertService.setAlert(
          'danger',
          globalConst.processSupportDraftsError
        );
        win.document.write(globalConst.processSupportDraftsError);
      }
    );
  }
}
