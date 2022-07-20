import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MemberRole } from '../api/models';
import { UserProfile } from '../api/models/user-profile';
import { ProfileService } from '../api/services';
import {
  AuthorizationService,
  ClaimModel,
  ClaimType
} from './authorization.service';
import { CacheService } from './cache.service';
import { AppBaseService } from './helper/appBase.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentProfileVal?: LoggedInUserProfile = null;

  constructor(
    private profileService: ProfileService,
    private authorizationService: AuthorizationService,
    private cacheService: CacheService,
    private appBaseService: AppBaseService
  ) {}

  public async loadUserProfile(): Promise<UserProfile> {
    const profile$ = await this.profileService
      .profileGetCurrentUserProfile()
      .pipe(
        tap((response) => {
          const userClaims = this.authorizationService.getClaimsForRole(
            MemberRole[response.role]
          );
          const taskNumber =
            this.cacheService.get('loggedInTaskNumber') === null || undefined
              ? null
              : this.cacheService.get('loggedInTaskNumber');
          const taskCommunity =
            this.cacheService.get('loggedInTaskCommunity') === null || undefined
              ? null
              : this.cacheService.get('loggedInTaskCommunity');
          const taskStartDate =
            this.cacheService.get('taskStartDate') === null || undefined
              ? null
              : this.cacheService.get('taskStartDate');

          const taskEndDate =
            this.cacheService.get('taskEndDate') === null || undefined
              ? null
              : this.cacheService.get('taskEndDate');
          this.currentProfileVal = {
            ...response,
            taskNumber,
            taskCommunity,
            taskStartDate,
            taskEndDate,
            claims: [...userClaims]
          };
          return this.currentProfileVal;
        })
      );

    return lastValueFrom(profile$);
  }

  public get currentProfile(): LoggedInUserProfile {
    return this.currentProfileVal;
  }

  public hasClaim(claimType: ClaimType, value: string): boolean {
    return (
      this.currentProfileVal &&
      this.currentProfileVal.claims.findIndex(
        (c) => c.claimType === claimType && c.claimValue === value
      ) >= 0
    );
  }

  public updateTaskNumber(
    taskNumber: string,
    taskStatus: string,
    taskCommunity: string,
    taskStartDate: string,
    taskEndDate: string
  ): void {
    this.cacheService.set('loggedInTaskNumber', taskNumber);
    this.cacheService.set('loggedInTaskCommunity', taskCommunity);
    this.cacheService.set('taskStartDate', taskStartDate);
    this.cacheService.set('taskEndDate', taskEndDate);
    this.currentProfileVal = {
      ...this.currentProfileVal,
      taskNumber,
      taskStatus,
      taskCommunity,
      taskStartDate,
      taskEndDate
    };
  }

  public clearAppStorage(): void {
    this.appBaseService.clear();
    this.cacheService.remove('loggedInTaskNumber');
    this.cacheService.remove('loggedInTaskCommunity');
    this.cacheService.remove('memberRoles');
    this.cacheService.remove('memberLabels');
    this.cacheService.remove('allTeamCommunityList');
    this.cacheService.remove('teamCommunityList');
    this.cacheService.remove('stateProvinceList');
    this.cacheService.remove('regionalDistrictsList');
    this.cacheService.remove('countriesList');
    this.cacheService.remove('communityList');
    this.cacheService.remove('supportCategory');
    this.cacheService.remove('supportSubCategory');
    this.cacheService.remove('supportStatus');
    this.cacheService.remove('taskStartDate');
    this.cacheService.remove('taskEndDate');

    this.cacheService.remove('registrantProfileId');
    this.cacheService.remove('memberRegistration');
    this.cacheService.remove('fileNumber');
    this.cacheService.remove('securityQuestionsOpenedFrom');
    this.cacheService.remove('fileLinkStatus');
    this.cacheService.remove('fileLinkFlag');
    this.cacheService.remove('fileLinkMetaData');
    this.cacheService.remove('wizardType');
    this.cacheService.remove('editWizardFlag');
    this.cacheService.remove('memberFlag');
    this.cacheService.remove('selectedSupplier');
    this.cacheService.remove('mutualAidEssTeams');
    this.cacheService.remove('selectedTeamMember');
    this.cacheService.remove('wizardMenu');

    this.cacheService.remove('groceriesReferral');
    this.cacheService.remove('mealReferral');
    this.cacheService.remove('taxiReferral');
    this.cacheService.remove('otherReferral');
    this.cacheService.remove('hotelMotelReferral');
    this.cacheService.remove('billetingReferral');
    this.cacheService.remove('groupReferral');
    this.cacheService.remove('supportType');

    this.cacheService.remove('previousEmail');
    this.cacheService.remove('previousMobile');
    this.clearLocalStorage();
  }

  public clearLocalStorage(): void {
    localStorage.clear();
  }
}

export interface LoggedInUserProfile extends UserProfile {
  taskNumber?: string;
  taskStatus?: string;
  taskCommunity?: string;
  claims: ClaimModel[];
  taskStartDate?: string;
  taskEndDate?: string;
}
