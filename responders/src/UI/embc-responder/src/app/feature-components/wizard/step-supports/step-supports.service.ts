import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Code, NeedsAssessment, Support } from 'src/app/core/api/models';
import { SupplierListItem } from 'src/app/core/api/models/supplier-list-item';
import { ConfigurationService, TasksService } from 'src/app/core/api/services';
import { EvacuationFileModel } from 'src/app/core/models/evacuation-file.model';
import { CacheService } from 'src/app/core/services/cache.service';
import { EssFileService } from 'src/app/core/services/ess-file.service';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
import { UserService } from 'src/app/core/services/user.service';

@Injectable({ providedIn: 'root' })
export class StepSupportsService {
  private supportCategoryVal: Code[] = [];
  private supportSubCategoryVal: Code[] = [];
  private currentNeedsAssessmentVal: NeedsAssessment;
  private existingSupportListVal: Support[];
  private supportTypeToAddVal: Code;
  private evacFileVal: EvacuationFileModel;

  constructor(
    private configService: ConfigurationService,
    private evacueeSessionService: EvacueeSessionService,
    private essFileService: EssFileService,
    private cacheService: CacheService,
    private taskService: TasksService,
    private userService: UserService
  ) {}

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

  set existingSupportList(existingSupportListVal: Support[]) {
    this.existingSupportListVal = existingSupportListVal;
  }

  get existingSupportList(): Support[] {
    return this.existingSupportListVal;
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
      .getFileFromId(
        '101169' //this.evacueeSessionService.essFileNumber
      )
      .subscribe((file) => {
        this.currentNeedsAssessment = file.needsAssessment;
        console.log(file.supports);
        this.existingSupportList = file.supports.sort(
          (a, b) => new Date(b.from).valueOf() - new Date(a.from).valueOf()
        );
        this.evacFile = file;
      });
  }

  public getSupplierList(): Observable<SupplierListItem[]> {
    return this.taskService.tasksGetSuppliersList({
      taskId: this.userService.currentProfile.taskNumber
    });
  }
}
