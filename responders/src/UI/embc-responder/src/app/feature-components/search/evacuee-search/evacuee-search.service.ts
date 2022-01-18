import { Injectable } from '@angular/core';
import { Code } from 'src/app/core/api/models';
import { ConfigurationService } from 'src/app/core/api/services';
import { EvacueeSearchContextModel } from 'src/app/core/models/evacuee-search-context.model';
import { CacheService } from 'src/app/core/services/cache.service';
import { UserService } from 'src/app/core/services/user.service';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import * as globalConst from '../../../core/services/global-constants';
import { TaskSearchService } from '../task-search/task-search.service';

@Injectable({
  providedIn: 'root'
})
export class EvacueeSearchService {
  private searchContext: EvacueeSearchContextModel;
  private supportCategoryVal: Code[] = [];
  private supportSubCategoryVal: Code[] = [];

  constructor(
    private cacheService: CacheService,
    private configService: ConfigurationService,
    private alertService: AlertService,
    private taskSearchService: TaskSearchService,
    private userService: UserService
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

  public getCategoryList(): void {
    this.configService
      .configurationGetCodes({ forEnumType: 'SupportCategory' })
      .subscribe({
        next: (categories: Code[]) => {
          this.supportCategory = categories.filter(
            (category) => category.description !== null
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
            (subCategory) => subCategory.description !== null
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

  public clearEvacueeSearch(): void {
    this.evacueeSearchContext = undefined;
  }
}
