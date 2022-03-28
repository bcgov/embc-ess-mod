import { Injectable } from '@angular/core';
import { Code } from 'src/app/core/api/models';
import { ConfigurationService } from 'src/app/core/api/services';
import { EvacueeSearchContextModel } from 'src/app/core/models/evacuee-search-context.model';
import { CacheService } from 'src/app/core/services/cache.service';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import * as globalConst from '../../../core/services/global-constants';

@Injectable({
  providedIn: 'root'
})
export class EvacueeSearchService {
  private searchContext: EvacueeSearchContextModel;
  private paperBasedEssFileVal: string;
  private supportCategoryVal: Code[] = [];
  private supportSubCategoryVal: Code[] = [];
  private supportStatusVal: Code[] = [];

  constructor(
    private cacheService: CacheService,
    private configService: ConfigurationService,
    private alertService: AlertService
  ) {}

  public get evacueeSearchContext(): EvacueeSearchContextModel {
    return this.searchContext === null || this.searchContext === undefined
      ? JSON.parse(this.cacheService.get('evacueeSearchContext'))
      : this.searchContext;
  }

  public set evacueeSearchContext(searchContext: EvacueeSearchContextModel) {
    this.searchContext = {
      ...this.searchContext,
      ...searchContext
    };
    this.cacheService.set('evacueeSearchContext', this.searchContext);
  }

  get supportCategory(): Code[] {
    return this.supportCategoryVal.length > 0
      ? this.supportCategoryVal
      : JSON.parse(this.cacheService.get('supportCategory'))
      ? JSON.parse(this.cacheService.get('supportCategory'))
      : this.getCategoryList();
  }

  set supportCategory(supportCategoryVal: Code[]) {
    this.supportCategoryVal = supportCategoryVal;
    this.cacheService.set('supportCategory', supportCategoryVal);
  }

  set supportSubCategory(supportSubCategoryVal: Code[]) {
    this.supportSubCategoryVal = supportSubCategoryVal;
    this.cacheService.set('supportSubCategory', supportSubCategoryVal);
  }

  get supportSubCategory() {
    return this.supportSubCategoryVal.length > 0
      ? this.supportSubCategoryVal
      : JSON.parse(this.cacheService.get('supportSubCategory'))
      ? JSON.parse(this.cacheService.get('supportSubCategory'))
      : this.getSubCategoryList();
  }

  public get paperBasedEssFile(): string {
    return this.paperBasedEssFileVal
      ? this.paperBasedEssFileVal
      : this.cacheService.get('paperBasedEssFile');
  }

  public set paperBasedEssFile(paperBasedEssFileVal: string) {
    this.paperBasedEssFileVal = paperBasedEssFileVal;
    this.cacheService.set('paperBasedEssFile', paperBasedEssFileVal);
  }

  public getCategoryList(): void {
    this.configService
      .configurationGetCodes({ forEnumType: 'SupportCategory' })
      .subscribe({
        next: (categories: Code[]) => {
          this.supportCategory = categories.filter(
            (category) => category.description
          );
        },
        error: (error) => {
          this.alertService.clearAlert();
          this.alertService.setAlert(
            'danger',
            globalConst.supportCategoryListError
          );
        }
      });
  }

  public getSubCategoryList(): void {
    this.configService
      .configurationGetCodes({ forEnumType: 'SupportSubCategory' })
      .subscribe({
        next: (subCategories: Code[]) => {
          this.supportSubCategory = subCategories.filter(
            (subCategory) => subCategory.description
          );
        },
        error: (error) => {
          this.alertService.clearAlert();
          this.alertService.setAlert(
            'danger',
            globalConst.supportCategoryListError
          );
        }
      });
  }

  get supportStatus(): Code[] {
    return this.supportStatusVal.length > 0
      ? this.supportStatusVal
      : JSON.parse(this.cacheService.get('supportStatus'))
      ? JSON.parse(this.cacheService.get('supportStatus'))
      : this.getStatusList();
  }

  set supportStatus(supportStatusVal: Code[]) {
    this.supportStatusVal = supportStatusVal;
    this.cacheService.set('supportStatus', supportStatusVal);
  }

  public getStatusList(): void {
    this.configService
      .configurationGetCodes({ forEnumType: 'SupportStatus' })
      .subscribe({
        next: (categories: Code[]) => {
          this.supportStatus = categories.filter(
            (status) => status.description
          );
        },
        error: (error) => {
          this.alertService.clearAlert();
          this.alertService.setAlert(
            'danger',
            globalConst.supportStatusListError
          );
        }
      });
  }

  public clearEvacueeSearch(): void {
    this.evacueeSearchContext = undefined;
    this.paperBasedEssFile = undefined;
  }
}
