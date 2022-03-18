import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  ClothingSupport,
  FoodGroceriesSupport,
  FoodRestaurantSupport,
  IncidentalsSupport,
  Support,
  TransportationTaxiSupport,
  TransportationOtherSupport,
  LodgingHotelSupport,
  LodgingBilletingSupport,
  LodgingGroupSupport,
  Referral
} from 'src/app/core/api/models';
import { StepSupportsService } from '../../step-supports/step-supports.service';
import * as globalConst from '../../../../core/services/global-constants';
import { AddressModel } from 'src/app/core/models/address.model';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { ViewAssessmentDialogComponent } from 'src/app/shared/components/dialog-components/view-assessment-dialog/view-assessment-dialog.component';
import { EvacuationFileModel } from 'src/app/core/models/evacuation-file.model';
import { VoidReferralDialogComponent } from 'src/app/shared/components/dialog-components/void-referral-dialog/void-referral-dialog.component';
import { ReprintReferralDialogComponent } from 'src/app/shared/components/dialog-components/reprint-referral-dialog/reprint-referral-dialog.component';
import { ExistingSupportDetailsService } from './existing-support-details.service';
import { InformationDialogComponent } from 'src/app/shared/components/dialog-components/information-dialog/information-dialog.component';
import { ReferralCreationService } from '../../step-supports/referral-creation.service';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
import { StepEssFileService } from '../../step-ess-file/step-ess-file.service';
import { DownloadService } from 'src/app/core/services/download.service';
import { FlatDateFormatPipe } from 'src/app/shared/pipes/flatDateFormat.pipe';

@Component({
  selector: 'app-existing-support-details',
  templateUrl: './existing-support-details.component.html',
  styleUrls: ['./existing-support-details.component.scss']
})
export class ExistingSupportDetailsComponent implements OnInit {
  selectedSupport: Support;
  needsAssessmentForSupport: EvacuationFileModel;
  isLoading = false;
  color = '#169BD5';

  constructor(
    private router: Router,
    public stepSupportsService: StepSupportsService,
    private stepEssFileService: StepEssFileService,
    private dialog: MatDialog,
    private existingSupportService: ExistingSupportDetailsService,
    private referralCreationService: ReferralCreationService,
    private alertService: AlertService,
    public evacueeSessionService: EvacueeSessionService,
    private downloadService: DownloadService
  ) {}

  ngOnInit(): void {
    this.selectedSupport = this.stepSupportsService.selectedSupportDetail;
    this.needsAssessmentForSupport = this.stepEssFileService.selectedEssFile;
  }

  back() {
    this.router.navigate(['/ess-wizard/add-supports/view']);
  }

  generateSupportType(element: Support): string {
    if (element?.subCategory === 'None') {
      const category = this.stepSupportsService.supportCategory.find(
        (value) => value.value === element?.category
      );
      return category?.description;
    } else {
      const subCategory = this.stepSupportsService.supportSubCategory.find(
        (value) => value.value === element?.subCategory
      );
      return subCategory?.description;
    }
  }

  checkGroceryMaxRate(): boolean {
    const maxRate =
      globalConst.groceriesRate.rate *
      (this.selectedSupport as FoodGroceriesSupport).numberOfDays *
      (this.selectedSupport as FoodGroceriesSupport).includedHouseholdMembers
        .length;
    return maxRate < (this.selectedSupport as FoodGroceriesSupport).totalAmount
      ? false
      : true;
  }

  checkIncidentalMaxRate(): boolean {
    const maxRate =
      globalConst.incidentals.rate *
      (this.selectedSupport as IncidentalsSupport).includedHouseholdMembers
        .length;
    return maxRate < (this.selectedSupport as IncidentalsSupport).totalAmount
      ? false
      : true;
  }

  checkClothingMaxRate(): boolean {
    const rate = (this.selectedSupport as ClothingSupport)
      .extremeWinterConditions
      ? globalConst.extremeConditions.rate
      : globalConst.normalConditions.rate;
    const maxRate =
      rate *
      (this.selectedSupport as ClothingSupport).includedHouseholdMembers
        .length;
    return maxRate < (this.selectedSupport as IncidentalsSupport).totalAmount
      ? false
      : true;
  }

  get groceryReferral(): FoodGroceriesSupport {
    return this.selectedSupport as FoodGroceriesSupport;
  }

  get mealReferral(): FoodRestaurantSupport {
    return this.selectedSupport as FoodRestaurantSupport;
  }

  get taxiReferral(): TransportationTaxiSupport {
    return this.selectedSupport as TransportationTaxiSupport;
  }

  get otherReferral(): TransportationOtherSupport {
    return this.selectedSupport as TransportationOtherSupport;
  }

  get hotelReferral(): LodgingHotelSupport {
    return this.selectedSupport as LodgingHotelSupport;
  }

  get billetingReferral(): LodgingBilletingSupport {
    return this.selectedSupport as LodgingBilletingSupport;
  }

  get groupReferral(): LodgingGroupSupport {
    return this.selectedSupport as LodgingGroupSupport;
  }

  get incidentalReferral(): IncidentalsSupport {
    return this.selectedSupport as IncidentalsSupport;
  }

  get clothingReferral(): ClothingSupport {
    return this.selectedSupport as ClothingSupport;
  }

  get referral(): Referral {
    return this.selectedSupport.supportDelivery as Referral;
  }

  get supplierAddress(): AddressModel {
    return this.referral?.supplierAddress as AddressModel;
  }

  openAssessment(): void {
    this.isLoading = !this.isLoading;
    this.stepSupportsService
      .getNeedsAssessmentInfo(
        this.needsAssessmentForSupport.id,
        this.selectedSupport.needsAssessmentId
      )
      .subscribe((response) => {
        this.dialog.open(DialogComponent, {
          data: {
            component: ViewAssessmentDialogComponent,
            profileData: response
          },
          height: '650px',
          width: '720px'
        });
        this.isLoading = !this.isLoading;
      });
  }

  voidReferral(): void {
    this.dialog
      .open(DialogComponent, {
        data: {
          component: VoidReferralDialogComponent,
          profileData: this.selectedSupport.id
        },
        height: '550px',
        width: '720px'
      })
      .afterClosed()
      .subscribe({
        next: (reason) => {
          if (reason !== undefined && reason !== 'close') {
            this.existingSupportService
              .voidSupport(
                this.needsAssessmentForSupport.id,
                this.selectedSupport.id,
                reason
              )
              .subscribe({
                next: (value) => {
                  const stateIndicator = { action: 'void' };
                  this.router.navigate(['/ess-wizard/add-supports/view'], {
                    state: stateIndicator
                  });
                },
                error: (error) => {
                  this.alertService.clearAlert();
                  this.alertService.setAlert(
                    'danger',
                    globalConst.voidReferralError
                  );
                }
              });
          }
        }
      });
  }

  reprint(): void {
    this.dialog
      .open(DialogComponent, {
        data: {
          component: ReprintReferralDialogComponent,
          profileData: this.selectedSupport.id
        },
        height: '550px',
        width: '720px'
      })
      .afterClosed()
      .subscribe({
        next: (reason) => {
          if (reason !== undefined && reason !== 'close') {
            this.isLoading = !this.isLoading;
            this.existingSupportService
              .reprintSupport(
                this.needsAssessmentForSupport.id,
                this.selectedSupport.id,
                reason
              )
              .subscribe({
                next: (response) => {
                  const blob = new Blob([response], { type: response.type });
                  this.downloadService.downloadFile(
                    window,
                    blob,
                    `support-${
                      this.selectedSupport.id
                    }-${new FlatDateFormatPipe().transform(new Date())}.pdf`
                  );
                  this.isLoading = !this.isLoading;
                },
                error: (error) => {
                  this.isLoading = !this.isLoading;
                  this.alertService.clearAlert();
                  this.alertService.setAlert(
                    'danger',
                    globalConst.reprintReferralError
                  );
                }
              });
          }
        }
      });
  }

  mapMemberName(memberId: string): string {
    const memberObject = this.needsAssessmentForSupport?.householdMembers.find(
      (value) => {
        if (value?.id === memberId) {
          return value;
        }
      }
    );
    return memberObject?.lastName + ',' + memberObject?.firstName;
  }

  deleteDraft(): void {
    this.dialog
      .open(DialogComponent, {
        data: {
          component: InformationDialogComponent,
          content: globalConst.deleteDraftMessage
        },
        width: '620px'
      })
      .afterClosed()
      .subscribe((value) => {
        if (value === 'confirm') {
          const supportType = this.selectedSupport.subCategory
            ? this.selectedSupport.subCategory
            : this.selectedSupport.category;
          this.referralCreationService
            .clearDraftSupports(supportType, this.selectedSupport)
            .subscribe((incomingValue) => {
              const stateIndicator = { action: 'delete' };
              this.router.navigate(['/ess-wizard/add-supports/view'], {
                state: stateIndicator
              });
            });
        }
      });
  }

  editDraft(): void {
    this.existingSupportService.createEditableDraft(
      this.selectedSupport,
      this.needsAssessmentForSupport
    );
    this.router.navigate(['/ess-wizard/add-supports/details'], {
      state: { action: 'edit' }
    });
  }
}
