import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  Code,
  NeedsAssessment,
  Support,
  SupportSubCategory,
  Referral,
  SupportStatus,
  SupportMethod,
  SupportCategory,
  EvacuationFile
} from 'src/app/core/api/models';
import { SupplierListItem } from 'src/app/core/api/models/supplier-list-item';
import { RegistrationsService, TasksService } from 'src/app/core/api/services';
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
import { EvacueeSearchService } from '../../search/evacuee-search/evacuee-search.service';
import { DateConversionService } from 'src/app/core/services/dateConversion.service';

@Injectable({ providedIn: 'root' })
export class StepSupportsService {
  private supportCategoryVal: Code[] = [];
  private supportSubCategoryVal: Code[] = [];
  private currentNeedsAssessmentVal: NeedsAssessment;
  private existingSupportListVal: BehaviorSubject<Support[]> =
    new BehaviorSubject<Support[]>([]);
  private existingSupportListVal$: Observable<Support[]> =
    this.existingSupportListVal.asObservable();
  private supportTypeToAddVal: Code;
  private evacFileVal: EvacuationFileModel;
  private supplierListVal: SupplierListItemModel[];
  private supportDetailsVal: SupportDetailsModel;
  private supportDeliveryVal: SupportDeliveryModel;
  private selectedSupportDetailVal: Support;

  constructor(
    private essFileService: EssFileService,
    private cacheService: CacheService,
    private taskService: TasksService,
    private userService: UserService,
    private locationService: LocationsService,
    private dialog: MatDialog,
    private referralService: ReferralCreationService,
    private evacueeSearchService: EvacueeSearchService,
    private registrationsService: RegistrationsService,
    private dateConversionService: DateConversionService
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
    this.supportCategory = this.evacueeSearchService.supportCategory;
    // this.configService
    //   .configurationGetCodes({ forEnumType: 'SupportCategory' })
    //   .subscribe(
    //     (categories: Code[]) => {
    //       this.supportCategory = categories.filter(
    //         (category) => category.description !== null
    //       );
    //     },
    //     (error) => {
    //       this.alertService.clearAlert();
    //       this.alertService.setAlert(
    //         'danger',
    //         globalConst.supportCategoryListError
    //       );
    //     }
    //   );
  }

  public getSubCategoryList(): void {
    this.supportSubCategory = this.evacueeSearchService.supportSubCategory;
    // this.configService
    //   .configurationGetCodes({ forEnumType: 'SupportSubCategory' })
    //   .subscribe(
    //     (subCategories: Code[]) => {
    //       this.supportSubCategory = subCategories.filter(
    //         (subCategory) => subCategory.description !== null
    //       );
    //     },
    //     (error) => {
    //       this.alertService.clearAlert();
    //       this.alertService.setAlert(
    //         'danger',
    //         globalConst.supportCategoryListError
    //       );
    //     }
    //   );
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

    const referral: Referral = {
      manualReferralId:
        this.supportDetails.externalReferenceId !== undefined
          ? 'R' + this.supportDetails.externalReferenceId
          : '',
      issuedToPersonName:
        this.supportDelivery.issuedTo !== 'Someone else'
          ? this.supportDelivery.issuedTo.lastName +
            ',' +
            this.supportDelivery.issuedTo.firstName
          : this.supportDelivery.name,
      supplierAddress: this.supportDelivery.supplier.address,
      supplierId: this.supportDelivery.supplier.id,
      supplierName: this.supportDelivery.supplier.name,
      supplierNotes: this.supportDelivery.supplierNote,
      method: SupportMethod.Referral
    };

    const support: Support = {
      issuedBy: this.supportDetails.issuedBy,
      issuedOn: this.supportDetails.issuedOn,
      from: this.dateConversionService.createDateTimeString(
        this.supportDetails.fromDate,
        this.supportDetails.fromTime
      ),
      includedHouseholdMembers: members,
      needsAssessmentId: this.evacFile.id,
      status: SupportStatus.Draft,
      to: this.dateConversionService.createDateTimeString(
        this.supportDetails.toDate,
        this.supportDetails.toTime
      ),
      category: null,
      method: SupportMethod.Referral,
      subCategory: null,
      supportDelivery: referral
    };

    // const support: Support = {
    //   ...support,
    //   method: SupportMethod.Referral,
    //   supportDelivery: referral
    // };
    if (this.supportTypeToAdd.value === SupportSubCategory.Food_Restaurant) {
      this.referralService.createMealReferral(support, this.supportDetails);
    } else if (
      this.supportTypeToAdd.value === SupportSubCategory.Food_Groceries
    ) {
      this.referralService.createGroceriesReferral(
        support,
        this.supportDetails
      );
    } else if (
      this.supportTypeToAdd.value === SupportSubCategory.Transportation_Taxi
    ) {
      this.referralService.createTaxiReferral(support, this.supportDetails);
    } else if (
      this.supportTypeToAdd.value === SupportSubCategory.Transportation_Other
    ) {
      this.referralService.createOtherReferral(support, this.supportDetails);
    } else if (
      this.supportTypeToAdd.value === SupportSubCategory.Lodging_Billeting
    ) {
      this.referralService.createBilletingReferral(
        support,
        this.supportDetails,
        this.supportDelivery
      );
    } else if (
      this.supportTypeToAdd.value === SupportSubCategory.Lodging_Group
    ) {
      this.referralService.createGroupLodgingReferral(
        support,
        this.supportDetails,
        this.supportDelivery
      );
    } else if (
      this.supportTypeToAdd.value === SupportSubCategory.Lodging_Hotel
    ) {
      this.referralService.createHotelMotelReferral(
        support,
        this.supportDetails
      );
    } else if (this.supportTypeToAdd.value === SupportCategory.Incidentals) {
      this.referralService.createIncidentalsReferral(
        support,
        this.supportDetails
      );
    } else if (this.supportTypeToAdd.value === SupportCategory.Clothing) {
      this.referralService.createClothingReferral(support, this.supportDetails);
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

  getNeedsAssessmentInfo(
    fileId: string,
    needsAssessmentId: string
  ): Observable<EvacuationFileModel> {
    return this.registrationsService
      .registrationsGetFile({
        fileId,
        needsAssessmentId
      })
      .pipe(
        map((file: EvacuationFile): EvacuationFileModel => {
          return {
            ...file,
            evacuatedFromAddress:
              this.locationService.getAddressModelFromAddress(
                file.evacuatedFromAddress
              ),
            assignedTaskCommunity: this.locationService.mapCommunityFromCode(
              file?.task?.communityCode
            )
          };
        })
      );
  }
}
