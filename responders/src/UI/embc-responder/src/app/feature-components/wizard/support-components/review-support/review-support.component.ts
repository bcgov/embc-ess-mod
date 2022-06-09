import { Component, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Router } from '@angular/router';
import {
  FoodGroceriesSupport,
  FoodRestaurantSupport,
  TransportationTaxiSupport,
  TransportationOtherSupport,
  LodgingHotelSupport,
  LodgingBilletingSupport,
  LodgingGroupSupport,
  IncidentalsSupport,
  ClothingSupport,
  Referral,
  Support,
  SupportMethod,
  Interac
} from 'src/app/core/api/models';
import { AddressModel } from 'src/app/core/models/address.model';
import { LocationsService } from 'src/app/core/services/locations.service';
import * as globalConst from '../../../../core/services/global-constants';
import { ReferralCreationService } from '../../step-supports/referral-creation.service';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { ProcessSupportsDialogComponent } from 'src/app/shared/components/dialog-components/process-supports-dialog/process-supports-dialog.component';
import { ReviewSupportService } from './review-support.service';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
import { InformationDialogComponent } from 'src/app/shared/components/dialog-components/information-dialog/information-dialog.component';
import { AppBaseService } from 'src/app/core/services/helper/appBase.service';
import { DownloadService } from '../../../../core/services/utility/download.service';
import { FlatDateFormatPipe } from '../../../../shared/pipes/flatDateFormat.pipe';

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
  supportMethod = SupportMethod;

  constructor(
    private router: Router,
    private locationService: LocationsService,
    private referralService: ReferralCreationService,
    private reviewSupportService: ReviewSupportService,
    private alertService: AlertService,
    private dialog: MatDialog,
    public evacueeSessionService: EvacueeSessionService,
    public appBaseService: AppBaseService,
    private downloadService: DownloadService
  ) {}

  ngOnInit(): void {
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
      (support as FoodGroceriesSupport).numberOfDays *
      (support as FoodGroceriesSupport).includedHouseholdMembers.length;
    return maxRate < (support as FoodGroceriesSupport).totalAmount
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
      (support as IncidentalsSupport).includedHouseholdMembers.length;
    return maxRate < (support as IncidentalsSupport).totalAmount ? false : true;
  }

  /**
   * Calculates if the current support surpass the maximum rate allowed
   *
   * @param support the support to check grocery max rate
   * @returns if the current support surpasses the max rate allow or not
   */
  checkClothingMaxRate(support: Support): boolean {
    const rate = (support as ClothingSupport).extremeWinterConditions
      ? globalConst.extremeConditions.rate
      : globalConst.normalConditions.rate;
    const maxRate =
      rate * (support as ClothingSupport).includedHouseholdMembers.length;
    return maxRate < (support as IncidentalsSupport).totalAmount ? false : true;
  }

  /**
   * Returns the current support as a FoodGroceriesReferral
   *
   * @param support the support to cast as FoodGroceriesReferral
   * @returns a FoodGroceriesReferral object
   */
  getGroceryReferral(support: Support): FoodGroceriesSupport {
    return support as FoodGroceriesSupport;
  }

  /**
   * Returns the current support as a FoodRestaurantReferral
   *
   * @param support the support to cast as FoodRestaurantReferral
   * @returns a FoodRestaurantReferral object
   */
  getMealReferral(support: Support): FoodRestaurantSupport {
    return support as FoodRestaurantSupport;
  }

  /**
   * Returns the current support as a TransportationTaxiReferral
   *
   * @param support the support to cast as TransportationTaxiReferral
   * @returns a TransportationTaxiReferral object
   */
  getTaxiReferral(support: Support): TransportationTaxiSupport {
    return support as TransportationTaxiSupport;
  }

  /**
   * Returns the current support as a TransportationOtherReferral
   *
   * @param support the support to cast as TransportationOtherReferral
   * @returns a TransportationOtherReferral object
   */
  getOtherReferral(support: Support): TransportationOtherSupport {
    return support as TransportationOtherSupport;
  }

  /**
   * Returns the current support as a LodgingHotelReferral
   *
   * @param support the support to cast as LodgingHotelReferral
   * @returns a LodgingHotelReferral object
   */
  getHotelReferral(support: Support): LodgingHotelSupport {
    return support as LodgingHotelSupport;
  }

  /**
   * Returns the current support as a LodgingBilletingReferral
   *
   * @param support the support to cast as LodgingBilletingReferral
   * @returns a LodgingBilletingReferral object
   */
  getBilletingReferral(support: Support): LodgingBilletingSupport {
    return support as LodgingBilletingSupport;
  }

  /**
   * Returns the current support as a LodgingGroupReferral
   *
   * @param support the support to cast as LodgingGroupReferral
   * @returns a LodgingGroupReferral object
   */
  getGroupReferral(support: Support): LodgingGroupSupport {
    return support as LodgingGroupSupport;
  }

  /**
   * Returns the current support as a IncidentalsReferral
   *
   * @param support the support to cast as IncidentalsReferral
   * @returns a IncidentalsReferral object
   */
  getIncidentalReferral(support: Support): IncidentalsSupport {
    return support as IncidentalsSupport;
  }

  /**
   * Returns the current support as a ClothingReferral
   *
   * @param support the support to cast as ClothingReferral
   * @returns a ClothingReferral object
   */
  getClothingReferral(support: Support): ClothingSupport {
    return support as ClothingSupport;
  }

  /**
   * Returns the current support as a Referral
   *
   * @param support the support to cast as Referral
   * @returns a Referral object
   */
  getReferral(support: Support): Referral {
    return support.supportDelivery as Referral;
  }

  getInterac(support: Support): Interac {
    return support.supportDelivery as Interac;
  }

  getNotificationPreference(interac: Interac) {
    const types = [];
    if (interac.notificationEmail) types.push('Email');
    if (interac.notificationMobile) types.push('Mobile');
    return types.join(' & ');
  }

  includesEtranfer() {
    return (
      this.draftSupports.filter((s) => s.method === SupportMethod.ETransfer)
        .length > 0
    );
  }

  /**
   * Returns the current support Address as a AddressModel
   *
   * @param support the support's Address to cast as AddressModel
   * @returns a AddressModel object
   */
  getSupplierAddress(support: Support): AddressModel {
    const referral = support?.supportDelivery as Referral;
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
      this.evacueeSessionService.evacFile.needsAssessment.householdMembers.find(
        (member) => member.id === memberId
      ).lastName;
    const firstName =
      this.evacueeSessionService.evacFile.needsAssessment.householdMembers.find(
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
    if (this.evacueeSessionService.isPaperBased) {
      this.dialog
        .open(DialogComponent, {
          data: {
            component: InformationDialogComponent,
            content: globalConst.paperProcessSupports
          },
          width: '630px'
        })
        .afterClosed()
        .subscribe((value) => {
          if (value === 'confirm') {
            this.saveDraftSupports();
          }
        });
    } else {
      if (!this.certificationAccepted) {
        this.showErrorMsg = true;
      } else {
        this.showErrorMsg = false;
        this.dialog
          .open(DialogComponent, {
            data: {
              component: ProcessSupportsDialogComponent,
              includesEtranfer: this.includesEtranfer()
            },
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
  }

  private saveDraftSupports() {
    this.showLoader = !this.showLoader;
    const supportsDraft: Support[] = this.referralService.getDraftSupport();
    const fileId: string = this.evacueeSessionService.evacFile.id;
    this.reviewSupportService
      .savePaperSupports(fileId, supportsDraft)
      .subscribe({
        next: (response) => {
          this.referralService.clearDraftSupport();
          this.reviewSupportService.updateExistingSupportsList();
          this.showLoader = !this.showLoader;
          this.router.navigate(['/ess-wizard/add-supports']);
        },
        error: (error) => {
          this.showLoader = !this.showLoader;
          this.alertService.clearAlert();
          this.alertService.setAlert(
            'danger',
            globalConst.processSupportDraftsError
          );
        }
      });
  }

  private processDraftSupports(): void {
    this.showLoader = !this.showLoader;
    const supportsDraft: Support[] = this.referralService.getDraftSupport();
    const fileId: string = this.evacueeSessionService.evacFile.id;
    this.reviewSupportService.processSupports(fileId, supportsDraft).subscribe({
      next: async (response) => {
        const blob = new Blob([response], { type: response.type });
        await this.downloadService.downloadFile(
          window,
          blob,
          `support-${fileId}-${new FlatDateFormatPipe().transform(
            new Date()
          )}.pdf`
        );

        //Clearing Draft supports array and updating the supports list for the selected ESS File
        this.referralService.clearDraftSupport();
        this.reviewSupportService.updateExistingSupportsList();
        this.showLoader = !this.showLoader;
        this.router.navigate(['/ess-wizard/add-supports']);
      },
      error: (error) => {
        console.error('error when processing supports: ', error);
        this.showLoader = !this.showLoader;
        this.alertService.clearAlert();
        this.alertService.setAlert(
          'danger',
          globalConst.processSupportDraftsError
        );
      }
    });
  }
}
