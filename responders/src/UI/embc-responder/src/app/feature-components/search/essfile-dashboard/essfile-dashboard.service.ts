import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { RegistrantProfile } from 'src/app/core/api/models';
import { RegistrationsService } from 'src/app/core/api/services';
import { EvacuationFileModel } from 'src/app/core/models/evacuation-file.model';
import { LinkRegistrantProfileModel } from 'src/app/core/models/link-registrant-profile.model';
import { CacheService } from 'src/app/core/services/cache.service';
import { ProfileSecurityQuestionsService } from '../profile-security-questions/profile-security-questions.service';

@Injectable({
  providedIn: 'root'
})
export class EssfileDashboardService {
  private essFileVal: EvacuationFileModel;

  constructor(
    private cacheService: CacheService,
    private registrationService: RegistrationsService,
    private profileSecurityQuestionsService: ProfileSecurityQuestionsService
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

  getPossibleProfileMatches(
    firstName: string,
    lastName: string,
    dateOfBirth: string
  ): Observable<LinkRegistrantProfileModel[]> {
    return this.registrationService
      .registrationsSearchMatchingRegistrants({
        firstName,
        lastName,
        dateOfBirth
      })
      .pipe(
        map((matchedProfiles: LinkRegistrantProfileModel[]) => {
          for (let profile of matchedProfiles) {
            this.profileSecurityQuestionsService
              .getSecurityQuestions(profile.id)
              .subscribe({
                next: (results) => {
                  if (results.questions.length === 0) {
                    profile.hasSecurityQuestions = false;
                  } else {
                    profile.hasSecurityQuestions = true;
                  }
                }
              });
          }
          return matchedProfiles;
        })
      );
  }
}
