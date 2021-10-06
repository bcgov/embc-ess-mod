import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Code, RegistrantProfile } from 'src/app/core/api/models';
import {
  ConfigurationService,
  RegistrationsService
} from 'src/app/core/api/services';
import { EvacuationFileModel } from 'src/app/core/models/evacuation-file.model';
import { CacheService } from 'src/app/core/services/cache.service';

@Injectable({
  providedIn: 'root'
})
export class EssfileDashboardService {
  private essFileVal: EvacuationFileModel;
  private supportCategoryVal: Code[];

  constructor(
    private cacheService: CacheService,
    private registrationService: RegistrationsService,
    private configService: ConfigurationService
  ) {}

  get essFile(): EvacuationFileModel {
    return this.essFileVal === null || this.essFileVal === undefined
      ? JSON.parse(this.cacheService.get('essFile'))
      : this.essFileVal;
  }

  set essFile(essFileVal: EvacuationFileModel) {
    this.essFileVal = essFileVal;
    this.cacheService.set('essFile', essFileVal);
  }

  get supportCategory(): Code[] {
    return this.supportCategoryVal;
  }

  set supportCategory(supportCategoryVal: Code[]) {
    this.supportCategoryVal = supportCategoryVal;
  }

  getPossibleProfileMatches(
    firstName: string,
    lastName: string,
    dateOfBirth: string
  ): Observable<RegistrantProfile[]> {
    return this.registrationService.registrationsSearchMatchingRegistrants({
      firstName,
      lastName,
      dateOfBirth
    });
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
}
