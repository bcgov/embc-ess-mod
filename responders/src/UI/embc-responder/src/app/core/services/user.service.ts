import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { MemberRole } from '../api/models';
import { UserProfile } from '../api/models/user-profile';
import { ProfileService } from '../api/services';
import {
  AuthorizationService,
  ClaimModel,
  ClaimType,
} from './authorization.service';
import { CacheService } from './cache.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private profile?: LoggedInUserProfile = null;

  constructor(
    private profileService: ProfileService,
    private authorizationService: AuthorizationService,
    private cacheService: CacheService
  ) {}

  public async loadUserProfile(): Promise<UserProfile> {
    return await this.profileService
      .profileGetCurrentUserProfile()
      .pipe(
        tap((response) => {
          const userClaims = this.authorizationService.getClaimsForRole(
            MemberRole[response.role]
          );
          const taskNumber =
            this.cacheService.get('loggedInTask') === null || undefined
              ? null
              : this.cacheService.get('loggedInTask');
          this.profile = { ...response, taskNumber, claims: [...userClaims] };
          return this.profile;
        })
      )
      .toPromise();
  }

  public get currentProfile(): LoggedInUserProfile {
    return this.profile;
  }

  public hasClaim(claimType: ClaimType, value: string): boolean {
    return (
      this.profile &&
      this.profile.claims.findIndex(
        (c) => c.claimType === claimType && c.claimValue === value
      ) >= 0
    );
  }

  public updateTaskNumber(taskNumber: string): void {
    this.cacheService.set('loggedInTask', taskNumber);
    this.profile = { ...this.profile, taskNumber };
  }

  public clearAppStorage(): void {
    this.cacheService.remove('loggedInTask');
    this.cacheService.remove('memberRoles');
    this.cacheService.remove('memberLabels');
    this.cacheService.remove('allTeamCommunityList');
    this.cacheService.remove('teamCommunityList');
  }
}

export interface LoggedInUserProfile extends UserProfile {
  taskNumber?: string;
  claims: ClaimModel[];
}
