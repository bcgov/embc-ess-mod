import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import {
  Code,
  NeedsAssessment,
  Support,
  SupportSubCategory,
  FoodRestaurantReferral,
  Referral,
  SupportStatus,
  SupportMethod,
  SupportCategory
} from 'src/app/core/api/models';
import { SupplierListItem } from 'src/app/core/api/models/supplier-list-item';
import { ConfigurationService, TasksService } from 'src/app/core/api/services';
import { DialogContent } from 'src/app/core/models/dialog-content.model';
import { EvacuationFileModel } from 'src/app/core/models/evacuation-file.model';
import { SupplierListItemModel } from 'src/app/core/models/supplier-list-item.model';
import {
  SupportDeliveryModel,
  SupportDetailsModel
} from 'src/app/core/models/support-details.model';
import { CacheService } from 'src/app/core/services/cache.service';
import { EssFileService } from 'src/app/core/services/ess-file.service';
import { LocationsService } from 'src/app/core/services/locations.service';
import { UserService } from 'src/app/core/services/user.service';
import { InformationDialogComponent } from 'src/app/shared/components/dialog-components/information-dialog/information-dialog.component';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { ReferralCreationService } from './referral-creation.service';
import * as globalConst from '../../../core/services/global-constants';
import * as moment from 'moment';

@Injectable({ providedIn: 'root' })
export class StepSupportsService {
  private supportCategoryVal: Code[] = [];
  private supportSubCategoryVal: Code[] = [];
  private currentNeedsAssessmentVal: NeedsAssessment;
  private existingSupportListVal: BehaviorSubject<
    Support[]
  > = new BehaviorSubject<Support[]>([]);
  private existingSupportListVal$: Observable<
    Support[]
  > = this.existingSupportListVal.asObservable();
  private supportTypeToAddVal: Code;
  private evacFileVal: EvacuationFileModel;
  private supplierListVal: SupplierListItemModel[];
  private supportDetailsVal: SupportDetailsModel;
  private supportDeliveryVal: SupportDeliveryModel;
  private selectedSupportDetailVal: Support;

  constructor(
    private configService: ConfigurationService,
    private essFileService: EssFileService,
    private cacheService: CacheService,
    private taskService: TasksService,
    private userService: UserService,
    private locationService: LocationsService,
    private dialog: MatDialog,
    private referralService: ReferralCreationService
  ) {}

  set selectedSupportDetail(selectedSupportDetailVal: Support) {
    this.selectedSupportDetailVal = selectedSupportDetailVal;
  }

  get selectedSupportDetail(): Support {
    return this.selectedSupportDetailVal;
  }

  set supportDetails(supportDetailsVal: SupportDetailsModel) {
    this.supportDetailsVal = supportDetailsVal;
  }

  get supportDetails(): SupportDetailsModel {
    return this.supportDetailsVal;
  }

  set supportDelivery(supportDeliveryVal: SupportDeliveryModel) {
    this.supportDeliveryVal = supportDeliveryVal;
  }

  get supportDelivery(): SupportDeliveryModel {
    return this.supportDeliveryVal;
  }

  set supportCategory(supportCategoryVal: Code[]) {
    this.supportCategoryVal = supportCategoryVal;
  }

  get supportCategory() {
    return this.supportCategoryVal;
  }

  set supportSubCategory(supportSubCategoryVal: Code[]) {
    this.supportSubCategoryVal = supportSubCategoryVal;
  }

  get supportSubCategory() {
    return this.supportSubCategoryVal;
  }

  set currentNeedsAssessment(currentNeedsAssessmentVal: NeedsAssessment) {
    this.currentNeedsAssessmentVal = currentNeedsAssessmentVal;
  }

  get currentNeedsAssessment(): NeedsAssessment {
    return this.currentNeedsAssessmentVal;
  }

  setExistingSupportList(existingSupportListVal: Support[]) {
    this.existingSupportListVal.next(existingSupportListVal);
  }

  getExistingSupportList(): Observable<Support[]> {
    return this.existingSupportListVal$;
  }

  set evacFile(evacFileVal: EvacuationFileModel) {
    this.evacFileVal = evacFileVal;
  }

  get evacFile(): EvacuationFileModel {
    return this.evacFileVal;
  }

  set supportTypeToAdd(supportTypeToAddVal: Code) {
    this.supportTypeToAddVal = supportTypeToAddVal;
    this.cacheService.set('supportType', JSON.stringify(supportTypeToAddVal));
  }

  get supportTypeToAdd(): Code {
    return this.supportTypeToAddVal
      ? this.supportTypeToAddVal
      : JSON.parse(this.cacheService.get('supportType'));
  }

  set supplierList(supplierListVal: SupplierListItemModel[]) {
    this.supplierListVal = supplierListVal;
  }

  get supplierList(): SupplierListItemModel[] {
    return this.supplierListVal;
  }

  public getCategoryList(): void {
    this.configService
      .configurationGetCodes({ forEnumType: 'SupportCategory' })
      .subscribe((categories: Code[]) => {
        console.log(categories);
        this.supportCategory = categories.filter(
          (category) => category.description !== null
        );
      });
  }

  public getSubCategoryList(): void {
    this.configService
      .configurationGetCodes({ forEnumType: 'SupportSubCategory' })
      .subscribe((subCategories: Code[]) => {
        this.supportSubCategory = subCategories.filter(
          (subCategory) => subCategory.description !== null
        );
      });
  }

  public getSupportTypeList(): Code[] {
    let combinedList: Code[] = [];
    const deleteCategories = new Set();

    // Taking categories from subcategories that should be deleted from category list:
    for (const subCategory of this.supportSubCategory) {
      const categoryName = subCategory.value?.split('_', 1).pop();
      deleteCategories.add(categoryName);
    }

    //Adding Categories to combinedList:
    this.supportCategory.forEach((item, index) => {
      let count = 0;
      for (const category of deleteCategories) {
        if (category === item.description) {
          count++;
        }
      }
      if (count === 0) {
        combinedList.push(item);
      }
    });

    combinedList = [...combinedList, ...this.supportSubCategory];
    return combinedList;
  }

  public getEvacFile(essFileNumber: string): Observable<EvacuationFileModel> {
    return this.essFileService.getFileFromId(essFileNumber); //'100963'
  }

  public getSupplierList(): Observable<Array<SupplierListItemModel>> {
    return this.taskService
      .tasksGetSuppliersList({
        taskId: this.userService.currentProfile.taskNumber
      })
      .pipe(
        map((supplierList: Array<SupplierListItem>) => {
          return supplierList.map((item: SupplierListItemModel) => {
            return {
              ...item,
              address: this.locationService.getAddressModelFromAddress(
                item.address
              )
            };
          });
        })
      );
  }

  public openDataLossPopup(
    content: DialogContent
  ): MatDialogRef<DialogComponent, string> {
    return this.dialog.open(DialogComponent, {
      data: {
        component: InformationDialogComponent,
        content
      },
      width: '530px'
    });
  }

  public editDraft() {
    this.referralService.updateDraftSupports(this.selectedSupportDetail);
    this.saveAsDraft();
  }

  public saveAsDraft() {
    const members: Array<string> = this.supportDetails.members.map((value) => {
      return value.id;
    });
    const support: Support = {
      from: this.convertDateTimeToString(
        this.supportDetails.fromDate,
        this.supportDetails.fromTime
      ),
      includedHouseholdMembers: members,
      needsAssessmentId: this.evacFile.id,
      status: SupportStatus.Draft,
      to: this.convertDateTimeToString(
        this.supportDetails.toDate,
        this.supportDetails.toTime
      ),
      category: null,
      method: null,
      subCategory: null
    };
    const referral: Referral = {
      ...support,
      issuedToPersonName:
        this.supportDelivery.issuedTo !== 'Someone else'
          ? this.supportDelivery.issuedTo.lastName +
            ',' +
            this.supportDelivery.issuedTo.firstName
          : this.supportDelivery.name,
      method: SupportMethod.Referral,
      supplierAddress: this.supportDelivery.supplier.address,
      supplierId: this.supportDelivery.supplier.id,
      supplierName: this.supportDelivery.supplier.name,
      supplierNotes: this.supportDelivery.supplierNote
    };
    if (this.supportTypeToAdd.value === SupportSubCategory.Food_Restaurant) {
      this.referralService.createMealReferral(referral, this.supportDetails);
    } else if (
      this.supportTypeToAdd.value === SupportSubCategory.Food_Groceries
    ) {
      this.referralService.createGroceriesReferral(
        referral,
        this.supportDetails
      );
    } else if (
      this.supportTypeToAdd.value === SupportSubCategory.Transportation_Taxi
    ) {
      this.referralService.createTaxiReferral(referral, this.supportDetails);
    } else if (
      this.supportTypeToAdd.value === SupportSubCategory.Transportation_Other
    ) {
      this.referralService.createOtherReferral(referral, this.supportDetails);
    } else if (
      this.supportTypeToAdd.value === SupportSubCategory.Lodging_Billeting
    ) {
      this.referralService.createBilletingReferral(
        referral,
        this.supportDetails,
        this.supportDelivery
      );
    } else if (
      this.supportTypeToAdd.value === SupportSubCategory.Lodging_Group
    ) {
      this.referralService.createGroupLodgingReferral(
        referral,
        this.supportDetails,
        this.supportDelivery
      );
    } else if (
      this.supportTypeToAdd.value === SupportSubCategory.Lodging_Hotel
    ) {
      this.referralService.createHotelMotelReferral(
        referral,
        this.supportDetails
      );
    } else if (this.supportTypeToAdd.value === SupportCategory.Incidentals) {
      this.referralService.createIncidentalsReferral(
        referral,
        this.supportDetails
      );
    } else if (this.supportTypeToAdd.value === SupportCategory.Clothing) {
      this.referralService.createClothingReferral(
        referral,
        this.supportDetails
      );
    }
  }

  getRateSheetContent(): DialogContent {
    if (this.supportTypeToAdd.value === SupportSubCategory.Food_Restaurant) {
      return globalConst.mealRateSheet;
    } else if (
      this.supportTypeToAdd.value === SupportSubCategory.Food_Groceries
    ) {
      return globalConst.groceriesRateSheet;
    } else if (
      this.supportTypeToAdd.value === SupportSubCategory.Transportation_Taxi
    ) {
      return globalConst.taxiRateSheet;
    } else if (
      this.supportTypeToAdd.value === SupportSubCategory.Transportation_Other
    ) {
      return globalConst.otherRateSheet;
    } else if (
      this.supportTypeToAdd.value === SupportSubCategory.Lodging_Billeting
    ) {
      return globalConst.billetingRateSheet;
    } else if (
      this.supportTypeToAdd.value === SupportSubCategory.Lodging_Hotel
    ) {
      return globalConst.hotelRateSheet;
    } else if (this.supportTypeToAdd.value === SupportCategory.Incidentals) {
      return globalConst.incidentalsRateSheet;
    } else if (this.supportTypeToAdd.value === SupportCategory.Clothing) {
      return globalConst.clothingRateSheet;
    }
  }

  convertDateTimeToString(date: string, time: string): string {
    const dateToDate = new Date(date);
    const hours = +time.split(':', 1).pop();
    const minutes = +time.split(':', 2).pop();

    dateToDate.setTime(dateToDate.getTime() + hours * 60 * 60 * 1000);
    dateToDate.setTime(dateToDate.getTime() + minutes * 60 * 1000);
    console.log(dateToDate);
    console.log(dateToDate.toISOString());

    // const day = dateToDate.getDate();
    // const month = dateToDate.getMonth() + 1;
    // const year = dateToDate.getFullYear();

    // let dayString = '' + day;
    // let monthString = '' + month;

    // if (day < 10) {
    //   dayString = '0' + day;
    // }

    // if (month < 10) {
    //   monthString = '0' + month;
    // }
    // return year + '-' + monthString + '-' + dayString + 'T' + time + ':00Z';
    return dateToDate.toISOString();
  }
}
