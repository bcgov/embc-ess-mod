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
  Referral,
  Interac
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
import { LoadEvacueeListService } from 'src/app/core/services/load-evacuee-list.service';
import { DownloadService } from '../../../../core/services/utility/download.service';
import { FlatDateFormatPipe } from '../../../../shared/pipes/flatDateFormat.pipe';
import { AppBaseService } from '../../../../core/services/helper/appBase.service';
import { WizardType } from '../../../../core/models/wizard-type.model';
import { CloneSupportDetailsService } from './clone-support-details.service';

@Component({
  selector: 'app-existing-support-details',
  templateUrl: './existing-support-details.component.html',
  styleUrls: ['./existing-support-details.component.scss']
})
export class ExistingSupportDetailsComponent implements OnInit {
  selectedSupport: Support;
  needsAssessmentForSupport: EvacuationFileModel;
  isLoading = false;
  isExtendSupports: boolean;

  constructor(
    private router: Router,
    public stepSupportsService: StepSupportsService,
    private stepEssFileService: StepEssFileService,
    public dialog: MatDialog,
    private existingSupportService: ExistingSupportDetailsService,
    private cloneSupportService: CloneSupportDetailsService,
    private referralCreationService: ReferralCreationService,
    private alertService: AlertService,
    public evacueeSessionService: EvacueeSessionService,
    private loadEvacueeListService: LoadEvacueeListService,
    private downloadService: DownloadService,
    private appBaseService: AppBaseService
  ) {}

  ngOnInit(): void {
    this.selectedSupport = this.stepSupportsService.selectedSupportDetail;
    this.needsAssessmentForSupport = this.stepEssFileService.selectedEssFile;
    this.isExtendSupports =
      this.appBaseService?.wizardProperties?.wizardType ===
      WizardType.ExtendSupports;
  }

  back() {
    this.router.navigate(['/ess-wizard/add-supports/view']);
  }

  generateSupportType(element: Support): string {
    if (element?.subCategory === 'None') {
      const category = this.loadEvacueeListService
        .getSupportCategories()
        .find((value) => value.value === element?.category);
      return category?.description;
    } else {
      const subCategory = this.loadEvacueeListService
        .getSupportSubCategories()
        .find((value) => value.value === element?.subCategory);
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
      (this.selectedSupport as ClothingSupport).includedHouseholdMembers.length;
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
    return this.selectedSupport?.supportDelivery as Referral;
  }

  get interac(): Interac {
    return this.selectedSupport?.supportDelivery as Interac;
  }

  get supplierAddress(): AddressModel {
    return this.referral?.supplierAddress as AddressModel;
  }

  openAssessment(): void {
    this.isLoading = !this.isLoading;
    this.stepSupportsService
      .getNeedsAssessmentInfo(
        this.needsAssessmentForSupport?.id,
        this.selectedSupport?.needsAssessmentId
      )
      .subscribe((response) => {
        this.dialog.open(DialogComponent, {
          data: {
            component: ViewAssessmentDialogComponent,
            profileData: response,
            showCloseButton: true
          },
          height: '85%',
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
          profileData: this.selectedSupport.id,
          voidType: this.selectedSupport.method
        },
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
        width: '720px'
      })
      .afterClosed()
      .subscribe({
        next: (output) => {
          if (
            output !== undefined &&
            output.reason !== undefined &&
            output.reason !== 'close'
          ) {
            this.isLoading = !this.isLoading;
            this.existingSupportService
              .reprintSupport(
                this.needsAssessmentForSupport.id,
                this.selectedSupport.id,
                output.reason,
                output.includeSummary
              )
              .subscribe({
                next: async (response) => {
                  const blob = new Blob([response], { type: response.type });
                  await this.downloadService.downloadFile(
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

  extendSupport(): void {
    this.dialog
      .open(DialogComponent, {
        data: {
          component: InformationDialogComponent,
          content: globalConst.extendSupportMessage
        },
        width: '720px'
      })
      .afterClosed()
      .subscribe({
        next: (output) => {
          if (output !== undefined && output !== 'cancel') {
            this.cloneSupportService.cloneSupport(
              this.selectedSupport,
              this.needsAssessmentForSupport
            );
            this.router.navigate(['/ess-wizard/add-supports/details'], {
              state: { action: 'clone' }
            });
          }
        }
      });
  }

  mapMemberName(householdMemberId: string): string {
    const memberObject = this.needsAssessmentForSupport?.householdMembers.find(
      (value) => {
        if (value?.id === householdMemberId) {
          return value;
        }
      }
    );
    return memberObject?.lastName + ', ' + memberObject?.firstName;
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

  cancelEtransfer(): void {
    this.dialog
      .open(DialogComponent, {
        data: {
          component: VoidReferralDialogComponent,
          profileData: this.selectedSupport.id,
          voidType: this.selectedSupport.method
        },
        width: '630px'
      })
      .afterClosed()
      .subscribe({
        next: (response) => {
          if (response === 'cancel') {
            this.existingSupportService
              .cancelSupport(
                this.needsAssessmentForSupport.id,
                this.selectedSupport.id
              )
              .subscribe({
                next: (value) => {
                  const stateIndicator = { action: 'cancel' };
                  this.router.navigate(['/ess-wizard/add-supports/view'], {
                    state: stateIndicator
                  });
                },
                error: (error) => {
                  this.alertService.clearAlert();
                  this.alertService.setAlert(
                    'danger',
                    globalConst.cancelEtransferError
                  );
                }
              });
          }
        }
      });
  }

  getStatusTextToDisplay(enumToText: string): string {
    return this.loadEvacueeListService
      .getSupportStatus()
      .find((statusValue) => statusValue.value === enumToText)?.description;
  }

  getMethodTextToDisplay(enumToText: string): string {
    return this.loadEvacueeListService
      .getSupportMethods()
      .find((method) => method.value === enumToText)?.description;
  }

  getNotificationPref(): string {
    if (this.interac.notificationEmail && this.interac.notificationMobile) {
      return 'Email & Mobile';
    } else if (
      this.interac.notificationEmail &&
      !this.interac.notificationMobile
    ) {
      return 'Email';
    } else {
      return 'Mobile';
    }
  }

  /**
   * Returns the full name of the igiven householmember ID
   *
   * @param memberId the member ID
   * @returns the Full LAST NAME, First Name of the given household member ID
   */
  getMemberFullName(memberId: string): string {
    const lastName =
      this.evacueeSessionService?.evacFile?.needsAssessment?.householdMembers.find(
        (member) =>
          member.id === memberId || member.linkedRegistrantId === memberId
      ).lastName;
    const firstName =
      this.evacueeSessionService?.evacFile?.needsAssessment?.householdMembers.find(
        (member) =>
          member.id === memberId || member.linkedRegistrantId === memberId
      ).firstName;

    return firstName.toLocaleUpperCase() + ' ' + lastName.toUpperCase();
  }
}
