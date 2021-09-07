import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  Code,
  NeedsAssessment,
  Support,
  SupportSubCategory,
  SupportCategory,
  FoodRestaurantReferral,
  Referral,
  SupportStatus,
  SupportMethod
} from 'src/app/core/api/models';
import { SupplierListItem } from 'src/app/core/api/models/supplier-list-item';
import { ConfigurationService, TasksService } from 'src/app/core/api/services';
import { DialogContent } from 'src/app/core/models/dialog-content.model';
import { EvacuationFileModel } from 'src/app/core/models/evacuation-file.model';
import { SupplierListItemModel } from 'src/app/core/models/supplier-list-item.model';
import {
  RestaurantMeal,
  SupportDeliveryModel,
  SupportDetailsModel
} from 'src/app/core/models/support-details.model';
import { CacheService } from 'src/app/core/services/cache.service';
import { EssFileService } from 'src/app/core/services/ess-file.service';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
import { LocationsService } from 'src/app/core/services/locations.service';
import { UserService } from 'src/app/core/services/user.service';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { InformationDialogComponent } from 'src/app/shared/components/dialog-components/information-dialog/information-dialog.component';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import * as globalConst from '../../../core/services/global-constants';

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
  private mealReferralVal: FoodRestaurantReferral;

  constructor(
    private configService: ConfigurationService,
    private evacueeSessionService: EvacueeSessionService,
    private essFileService: EssFileService,
    private cacheService: CacheService,
    private taskService: TasksService,
    private userService: UserService,
    private locationService: LocationsService,
    private alertService: AlertService,
    private dialog: MatDialog
  ) {}

  set mealReferral(mealReferralVal: FoodRestaurantReferral) {
    this.mealReferralVal = mealReferralVal;
  }

  get mealReferral(): FoodRestaurantReferral {
    return this.mealReferralVal
      ? this.mealReferralVal
      : JSON.parse(this.cacheService.get('mealReferral'));
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
    combinedList = [...combinedList, ...this.supportCategory];
    combinedList = [...combinedList, ...this.supportSubCategory];
    return combinedList;
  }

  public getEvacFile(): void {
    this.essFileService
      .getFileFromId(this.evacueeSessionService.essFileNumber) //101169
      .subscribe(
        (file) => {
          this.currentNeedsAssessment = file.needsAssessment;
          console.log(file.supports);
          this.setExistingSupportList(
            file.supports.sort(
              (a, b) => new Date(b.from).valueOf() - new Date(a.from).valueOf()
            )
          );
          this.evacFile = file;
        },
        (error) => {
          this.alertService.clearAlert();
          this.alertService.setAlert('danger', globalConst.genericError);
        }
      );
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

  public saveAsDraft() {
    const members: Array<string> = this.supportDetails.members.map((value) => {
      return value.id;
    });
    const support: Support = {
      from: this.supportDetails.fromDate,
      includedHouseholdMembers: members,
      needsAssessmentId: this.evacFile.id,
      status: SupportStatus.Draft,
      to: this.supportDetails.toDate
    };
    const referral: Referral = {
      ...support,
      issuedToPersonName: this.supportDelivery.issuedTo
        ? this.supportDelivery.issuedTo
        : this.supportDelivery.name,
      method: SupportMethod.Referral,
      supplierAddress: this.supportDelivery.supplier.address,
      supplierId: this.supportDelivery.supplier.id,
      supplierName: this.supportDelivery.supplier.name,
      supplierNotes: this.supportDelivery.supplierNote
    };
    if (this.supportTypeToAdd.description === SupportCategory.Food) {
      const mealReferral: FoodRestaurantReferral = {
        ...referral,
        category: SupportCategory.Food,
        numberOfBreakfastsPerPerson: (this.supportDetails
          .referral as RestaurantMeal).noOfBreakfast,
        numberOfDinnersPerPerson: (this.supportDetails
          .referral as RestaurantMeal).noOfDinners,
        numberOfLunchesPerPerson: (this.supportDetails
          .referral as RestaurantMeal).noOfLunches,
        subCategory: SupportSubCategory.Food_Restaurant,
        totalAmount: this.supportDetails.referral.totalAmount
      };
      this.cacheService.set('mealReferral', mealReferral);
    }
  }
}
