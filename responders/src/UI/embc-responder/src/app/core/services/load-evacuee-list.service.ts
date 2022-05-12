import { Injectable } from '@angular/core';
import { forkJoin, lastValueFrom, map, Observable } from 'rxjs';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { Code } from '../api/models';
import { ConfigurationService } from '../api/services';
import { CacheService } from './cache.service';
import * as globalConst from './global-constants';

@Injectable({ providedIn: 'root' })
export class LoadEvacueeListService {
  private supportCategoryVal: Code[] = [];
  private supportSubCategoryVal: Code[] = [];
  private supportStatusVal: Code[] = [];
  private supportMethodVal: Code[] = [];
  private voidReasonVal: Code[] = [];
  private reprintReasonVal: Code[] = [];
  private communityTypeVal: Code[] = [];

  constructor(
    private configService: ConfigurationService,
    private alertService: AlertService,
    private cacheService: CacheService
  ) {}

  public getSupportCategories(): Code[] {
    return this.supportCategoryVal.length > 0
      ? this.supportCategoryVal
      : JSON.parse(this.cacheService.get('supportCategory'))
      ? JSON.parse(this.cacheService.get('supportCategory'))
      : this.getCategoryList();
  }

  public getSupportSubCategories() {
    return this.supportSubCategoryVal.length > 0
      ? this.supportSubCategoryVal
      : JSON.parse(this.cacheService.get('supportSubCategory'))
      ? JSON.parse(this.cacheService.get('supportSubCategory'))
      : this.getSubCategoryList();
  }

  public getSupportStatus() {
    return this.supportStatusVal.length > 0
      ? this.supportStatusVal
      : JSON.parse(this.cacheService.get('supportStatus'))
      ? JSON.parse(this.cacheService.get('supportStatus'))
      : this.getSupportStatusList();
  }

  public getSupportMethods() {
    return this.supportMethodVal.length > 0
      ? this.supportMethodVal
      : JSON.parse(this.cacheService.get('supportMethod'))
      ? JSON.parse(this.cacheService.get('supportMethod'))
      : this.getSupportMethodList();
  }

  public getVoidReasons() {
    return this.voidReasonVal.length > 0
      ? this.voidReasonVal
      : JSON.parse(this.cacheService.get('voidReason'))
      ? JSON.parse(this.cacheService.get('voidReason'))
      : this.getVoidReasonsList();
  }

  public getReprintReasons() {
    return this.reprintReasonVal.length > 0
      ? this.reprintReasonVal
      : JSON.parse(this.cacheService.get('reprintReason'))
      ? JSON.parse(this.cacheService.get('reprintReason'))
      : this.getReprintReasonsList();
  }

  public getCommunityTypes() {
    return this.communityTypeVal.length > 0
      ? this.communityTypeVal
      : JSON.parse(this.cacheService.get('communityType'))
      ? JSON.parse(this.cacheService.get('communityType'))
      : this.getCommunityTypesList();
  }

  public loadStaticEvacueeLists(): Promise<void> {
    const categories: Observable<Array<Code>> =
      this.configService.configurationGetCodes({
        forEnumType: 'SupportCategory'
      });
    const subcategories: Observable<Array<Code>> =
      this.configService.configurationGetCodes({
        forEnumType: 'SupportSubCategory'
      });
    const status: Observable<Array<Code>> =
      this.configService.configurationGetCodes({
        forEnumType: 'SupportStatus'
      });
    const methods: Observable<Array<Code>> =
      this.configService.configurationGetCodes({
        forEnumType: 'SupportMethod'
      });
    const voidReasons: Observable<Array<Code>> =
      this.configService.configurationGetCodes({
        forEnumType: 'SupportVoidReason'
      });
    const reprintReasons: Observable<Array<Code>> =
      this.configService.configurationGetCodes({
        forEnumType: 'SupportReprintReason'
      });
    const communityTypes: Observable<Array<Code>> =
      this.configService.configurationGetCodes({
        forEnumType: 'CommunityType'
      });

    const list$ = forkJoin([
      categories,
      subcategories,
      status,
      methods,
      voidReasons,
      reprintReasons,
      communityTypes
    ]).pipe(
      map((results) => {
        this.setSupportCategories(
          results[0].filter((value) => value.description !== '')
        );
        this.setSupportSubCategories(results[1]);
        this.setSupportStatus(results[2]);
        this.setSupportMethods(results[3]);
        this.setVoidReasons(results[4]);
        this.setReprintReasons(results[5]);
        this.setCommunityTypes(results[6]);
      })
    );

    return lastValueFrom(list$);
  }

  public getSupportTypeList(): Code[] {
    let combinedList: Code[] = [];
    const deleteCategories = new Set();

    // Taking categories from subcategories that should be deleted from category list:
    for (const subCategory of this.supportSubCategoryVal) {
      const categoryName = subCategory.value?.split('_', 1).pop();
      deleteCategories.add(categoryName);
    }

    //Adding Categories to combinedList:
    this.supportCategoryVal.forEach((item, index) => {
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

    combinedList = [...combinedList, ...this.supportSubCategoryVal];
    return combinedList;
  }

  private getCategoryList(): Code[] {
    let categoryList: Code[] = [];
    this.configService
      .configurationGetCodes({ forEnumType: 'SupportCategory' })
      .subscribe({
        next: (categories: Code[]) => {
          categoryList = categories;
          this.setSupportCategories(
            categories.filter((value) => value.description !== '')
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

    return categoryList;
  }

  private setSupportCategories(supportCategoryVal: Code[]): void {
    this.supportCategoryVal = supportCategoryVal;
    this.cacheService.set('supportCategory', supportCategoryVal);
  }

  private getSubCategoryList(): Code[] {
    let subCategoryList: Code[] = [];
    this.configService
      .configurationGetCodes({ forEnumType: 'SupportSubCategory' })
      .subscribe({
        next: (subCategories: Code[]) => {
          subCategoryList = subCategories;
          this.setSupportSubCategories(subCategories);
        },
        error: (error) => {
          this.alertService.clearAlert();
          this.alertService.setAlert(
            'danger',
            globalConst.supportCategoryListError
          );
        }
      });
    return subCategoryList;
  }

  private setSupportSubCategories(supportSubCategoryVal: Code[]): void {
    this.supportSubCategoryVal = supportSubCategoryVal;
    this.cacheService.set('supportSubCategory', supportSubCategoryVal);
  }

  private getSupportStatusList(): Code[] {
    let supportStatusList: Code[] = [];
    this.configService
      .configurationGetCodes({ forEnumType: 'SupportStatus' })
      .subscribe({
        next: (supStatus: Code[]) => {
          supportStatusList = supStatus;
          this.setSupportStatus(supStatus);
        },
        error: (error) => {
          this.alertService.clearAlert();
          this.alertService.setAlert(
            'danger',
            globalConst.supportStatusListError
          );
        }
      });
    return supportStatusList;
  }

  private setSupportStatus(supportStatusVal: Code[]): void {
    this.supportStatusVal = supportStatusVal;
    this.cacheService.set('supportStatus', supportStatusVal);
  }

  private getSupportMethodList(): Code[] {
    let methodSupportList: Code[] = [];
    this.configService
      .configurationGetCodes({ forEnumType: 'SupportMethod' })
      .subscribe({
        next: (methods: Code[]) => {
          methodSupportList = methods;
          this.setSupportMethods(methods);
        },
        error: (error) => {
          this.alertService.clearAlert();
          this.alertService.setAlert(
            'danger',
            globalConst.supportMethodListError
          );
        }
      });
    return methodSupportList;
  }

  private setSupportMethods(supportMethodVal: Code[]): void {
    this.supportMethodVal = supportMethodVal;
    this.cacheService.set('supportMethod', supportMethodVal);
  }

  private getVoidReasonsList(): Code[] {
    let supportVoidReasonsList: Code[] = [];
    this.configService
      .configurationGetCodes({ forEnumType: 'SupportVoidReason' })
      .subscribe({
        next: (voidReasons: Code[]) => {
          supportVoidReasonsList = voidReasons;
          this.setVoidReasons(voidReasons);
        },
        error: (error) => {
          this.alertService.clearAlert();
          this.alertService.setAlert(
            'danger',
            globalConst.supportVoidReasonsError
          );
        }
      });
    return supportVoidReasonsList;
  }

  private setVoidReasons(voidReasonVal: Code[]): void {
    this.voidReasonVal = voidReasonVal;
    this.cacheService.set('voidReason', voidReasonVal);
  }

  private getReprintReasonsList(): Code[] {
    let supportReprintReasonsList: Code[] = [];
    this.configService
      .configurationGetCodes({ forEnumType: 'SupportReprintReason' })
      .subscribe({
        next: (reprintReasons: Code[]) => {
          supportReprintReasonsList = reprintReasons;
          this.setReprintReasons(reprintReasons);
        },
        error: (error) => {
          this.alertService.clearAlert();
          this.alertService.setAlert(
            'danger',
            globalConst.supportVoidReasonsError
          );
        }
      });
    return supportReprintReasonsList;
  }

  private setReprintReasons(reprintReasonVal: Code[]): void {
    this.reprintReasonVal = reprintReasonVal;
    this.cacheService.set('reprintReason', reprintReasonVal);
  }

  private getCommunityTypesList(): Code[] {
    let communityTypesList: Code[] = [];
    this.configService
      .configurationGetCodes({ forEnumType: 'CommunityType' })
      .subscribe({
        next: (communityTypes: Code[]) => {
          communityTypesList = communityTypes;
          this.setCommunityTypes(communityTypes);
        },
        error: (error) => {
          this.alertService.clearAlert();
          this.alertService.setAlert(
            'danger',
            globalConst.supportVoidReasonsError
          );
        }
      });
    return communityTypesList;
  }

  private setCommunityTypes(communityTypeVal: Code[]): void {
    this.communityTypeVal = communityTypeVal;
    this.cacheService.set('communityType', communityTypeVal);
  }
}
