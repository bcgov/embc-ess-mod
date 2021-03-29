import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { MemberRole } from '../api/models';
import { UserProfile } from '../api/models/user-profile';
import { ProfileService } from '../api/services';
import { AuthorizationService, ClaimModel, ClaimType } from './authorization.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private profile?: LoggedInUserProfile = null;

  constructor(private profileService: ProfileService, private authorizationService: AuthorizationService) { }

  public async loadUserProfile(): Promise<UserProfile> {
    return await this.profileService.profileGetCurrentUserProfile().pipe(tap(response => {
      const userClaims = this.authorizationService.getClaimsForRole(MemberRole[response.role]);
      this.profile = { ...response, taskNumber: null, claims: [...userClaims] };
      return this.profile;
    })).toPromise();
  }

  public get currentProfile(): LoggedInUserProfile {
    return this.profile;
  }

  public hasClaim(claimType: ClaimType, value: string): boolean {
    return this.profile.claims.findIndex(c => c.claimType === claimType && c.claimValue === value) >= 0;
  }

}

export interface LoggedInUserProfile extends UserProfile {
  taskNumber?: string;
  claims: ClaimModel[];
}
