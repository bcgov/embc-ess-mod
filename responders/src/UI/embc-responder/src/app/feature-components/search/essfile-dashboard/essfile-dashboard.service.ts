import { Injectable } from '@angular/core';

import { map, mergeMap, Observable, toArray } from 'rxjs';
import {
  GetSecurityQuestionsResponse,
  RegistrantProfile
} from 'src/app/core/api/models';
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

  public getPossibleProfileMatchesCombinedData(
    firstName: string,
    lastName: string,
    dateOfBirth: string
  ): Observable<LinkRegistrantProfileModel[]> {
    const matchedProfiles$ = this.getPossibleProfileMatches(
      firstName,
      lastName,
      dateOfBirth
    );
    const hasSecQuestions$ = matchedProfiles$.pipe(
      mergeMap((profiles) => profiles),
      mergeMap((matchProfile) => {
        const linkProfile$: Observable<LinkRegistrantProfileModel> =
          this.getHasSecurityQuestions(matchProfile);
        return linkProfile$;
      }),
      toArray()
    );

    return hasSecQuestions$;
  }

  private getPossibleProfileMatches(
    firstName: string,
    lastName: string,
    dateOfBirth: string
  ): Observable<RegistrantProfile[]> {
    return this.registrationService
      .registrationsSearchMatchingRegistrants({
        firstName,
        lastName,
        dateOfBirth
      })
      // .pipe(
      //   map(
      //     (
      //       matchedProfiles: RegistrantProfile[]
      //     ): LinkRegistrantProfileModel[] => {
      //       const linkProfiles: LinkRegistrantProfileModel[] = [];
      //       for (const profile of matchedProfiles) {
      //         const linkProfile: LinkRegistrantProfileModel = {
      //           ...profile
      //         };
      //         linkProfiles.push(linkProfile);
      //       }
      //       return linkProfiles;
      //     }
      //   )
      // );
  }

  private getHasSecurityQuestions(
    profile: RegistrantProfile
  ): Observable<LinkRegistrantProfileModel> {
    return this.profileSecurityQuestionsService
      .getSecurityQuestions(profile.id)
      .pipe(
        map(
          (
            response: GetSecurityQuestionsResponse
          ): LinkRegistrantProfileModel => {
            if (response.questions.length === 0) {
              return {
                ...profile,
                hasSecurityQuestions: false
              };
            } else {
              return {
                ...profile,
                hasSecurityQuestions: true
              };
            }
          }
        )
      );
  }


  mapLinkedModel(profile:RegistrantProfile, securityQues: GetSecurityQuestionsResponse) {

  }
}
