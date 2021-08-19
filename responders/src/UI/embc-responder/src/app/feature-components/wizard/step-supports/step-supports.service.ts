import { Injectable } from '@angular/core';
import { Code } from 'src/app/core/api/models';
import { ConfigurationService } from 'src/app/core/api/services';

@Injectable({ providedIn: 'root' })
export class StepSupportsService {
  private supportCategoryVal: Code[] = [];
  private supportSubCategoryVal: Code[] = [];

  constructor(private configService: ConfigurationService) {}

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
}
