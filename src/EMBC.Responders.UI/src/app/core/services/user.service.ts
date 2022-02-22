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

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentProfileVal?: LoggedInUserProfile = null;

  constructor(
    private profileService: ProfileService,
    private authorizationService: AuthorizationService,
    private cacheService: CacheService
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
          this.currentProfileVal = {
            ...response,
            taskNumber,
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

  public updateTaskNumber(taskNumber: string, taskStatus: string): void {
    this.cacheService.set('loggedInTaskNumber', taskNumber);
    this.currentProfileVal = {
      ...this.currentProfileVal,
      taskNumber,
      taskStatus
    };
  }

  public clearAppStorage(): void {
    this.cacheService.remove('loggedInTaskNumber');
    this.cacheService.remove('memberRoles');
    this.cacheService.remove('memberLabels');
    this.cacheService.remove('allTeamCommunityList');
    this.cacheService.remove('teamCommunityList');
    this.cacheService.remove('stateProvinceList');
    this.cacheService.remove('wizardOpenedFrom');
    this.cacheService.remove('regionalDistrictsList');
    this.cacheService.remove('countriesList');
    this.cacheService.remove('communityList');
    this.cacheService.remove('supportCategory');
    this.cacheService.remove('supportSubCategory');
    this.clearLocalStorage();
  }

  public clearLocalStorage(): void {
    localStorage.clear();
  }
}

export interface LoggedInUserProfile extends UserProfile {
  taskNumber?: string;
  taskStatus?: string;
  claims: ClaimModel[];
}
