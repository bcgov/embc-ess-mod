import { Injectable } from '@angular/core';

import { map, mergeMap, Observable, toArray } from 'rxjs';
import {
  EvacuationFileHouseholdMember,
  GetSecurityQuestionsResponse,
  HouseholdMemberType,
  RegistrantProfile
} from 'src/app/core/api/models';
import { RegistrationsService } from 'src/app/core/api/services';
import {
  HouseholdMemberButtons,
  SelectedPathType
} from 'src/app/core/models/appBase.model';
import { EvacuationFileModel } from 'src/app/core/models/evacuation-file.model';
import {
  LinkedRegistrantProfileResults,
  LinkRegistrantProfileModel
} from 'src/app/core/models/link-registrant-profile.model';
import { CacheService } from 'src/app/core/services/cache.service';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
import { AppBaseService } from 'src/app/core/services/helper/appBase.service';
import { ProfileSecurityQuestionsService } from '../profile-security-questions/profile-security-questions.service';

@Injectable({
  providedIn: 'root'
})
export class EssfileDashboardService {
  private essFileVal: EvacuationFileModel;
  private selectedMemberVal: EvacuationFileHouseholdMember;

  constructor(
    private cacheService: CacheService,
    private registrationService: RegistrationsService,
    private profileSecurityQuestionsService: ProfileSecurityQuestionsService,
    private appBaseService: AppBaseService,
    private evacueeSessionService: EvacueeSessionService
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

  public get selectedMember(): EvacuationFileHouseholdMember {
    return this.selectedMemberVal;
  }
  public set selectedMember(value: EvacuationFileHouseholdMember) {
    this.selectedMemberVal = value;
  }

  public getPossibleProfileMatchesCombinedData(
    firstName: string,
    lastName: string,
    dateOfBirth: string
  ): Observable<LinkedRegistrantProfileResults> {
    const matchedProfiles$ = this.getPossibleProfileMatches(
      firstName,
      lastName,
      dateOfBirth
    );
    const matchedProfilesResults$ = matchedProfiles$.pipe(
      mergeMap((profiles) => profiles),
      mergeMap((matchProfile) => {
        const linkProfile$: Observable<LinkRegistrantProfileModel> =
          this.getHasSecurityQuestions(matchProfile);
        return linkProfile$;
      }),
      toArray(),
      map(
        (
          hasSecQuest: LinkRegistrantProfileModel[]
        ): LinkedRegistrantProfileResults => {
          return {
            matchedProfiles: hasSecQuest,
            householdMemberDisplayButton: this.mapLinkedModel(hasSecQuest)
          };
        }
      )
    );

    return matchedProfilesResults$;
  }

  private getPossibleProfileMatches(
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

  private mapLinkedModel(
    matchedProfiles: LinkRegistrantProfileModel[]
  ): HouseholdMemberButtons {
    // Member has 0 profile match found
    if (matchedProfiles.length === 0) {
      return HouseholdMemberButtons.createProfile;

      // Member has 1 match and has security questions OR Member has more than 1 match
    } else if (
      (matchedProfiles.length === 1 &&
        matchedProfiles[0].hasSecurityQuestions) ||
      matchedProfiles.length > 1
    ) {
      return HouseholdMemberButtons.linkProfile;

      // Member has 1 match and doesn't have security questions
    } else if (
      matchedProfiles.length === 1 &&
      !matchedProfiles[0].hasSecurityQuestions
    ) {
      return HouseholdMemberButtons.cannotLinkProfile;

      // Default option
    } else {
      return undefined;
    }
  }
}
