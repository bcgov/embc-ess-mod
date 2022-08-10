import { Injectable } from '@angular/core';
import { UserProfile } from '../core/api/models';
import {
  ActionPermission,
  ClaimType
} from '../core/services/authorization.service';
import {
  LoggedInUserProfile,
  UserService
} from '../core/services/user.service';

@Injectable({ providedIn: 'root' })
export class MockUserService extends UserService {
  public userProfile: UserProfile;
  public currentProfileValue: LoggedInUserProfile;

  public profileTier3: LoggedInUserProfile = {
    taskNumber: '1234',
    taskStatus: 'Active',
    taskCommunity: '986adfaf-9f97-ea11-b813-005056830319',
    claims: [
      {
        claimType: ClaimType.action,
        claimValue: '0'
      },
      {
        claimType: ClaimType.action,
        claimValue: '2'
      },
      { claimType: ClaimType.module, claimValue: '0' },
      { claimType: ClaimType.module, claimValue: '1' },
      {
        claimType: ClaimType.action,
        claimValue: '1'
      },
      {
        claimType: ClaimType.action,
        claimValue: '12'
      },
      {
        claimType: ClaimType.action,
        claimValue: '14'
      },
      { claimType: ClaimType.module, claimValue: '2' },
      { claimType: ClaimType.module, claimValue: '3' },
      { claimType: ClaimType.module, claimValue: '5' },
      {
        claimType: ClaimType.action,
        claimValue: '3'
      },
      {
        claimType: ClaimType.action,
        claimValue: '4'
      },
      {
        claimType: ClaimType.action,
        claimValue: '13'
      },
      {
        claimType: ClaimType.action,
        claimValue: '15'
      },
      {
        claimType: ClaimType.action,
        claimValue: '16'
      },
      {
        claimType: ClaimType.action,
        claimValue: '17'
      }
    ],
    taskStartDate: '2021-11-29T19:32:00Z',
    taskEndDate: '2023-12-03T03:32:00Z'
  };

  public profileTier1: LoggedInUserProfile = {
    taskNumber: '1234',
    taskStatus: 'Active',
    taskCommunity: '986adfaf-9f97-ea11-b813-005056830319',
    claims: [
      {
        claimType: ClaimType.action,
        claimValue: '0'
      },
      {
        claimType: ClaimType.action,
        claimValue: '2'
      },
      { claimType: ClaimType.module, claimValue: '0' },
      { claimType: ClaimType.module, claimValue: '1' }
    ],
    taskStartDate: '2021-11-29T19:32:00Z',
    taskEndDate: '2023-12-03T03:32:00Z'
  };

  loadUserProfile(): Promise<UserProfile> {
    return Promise.resolve(this.userProfile);
  }

  public set currentProfile(profile: LoggedInUserProfile) {
    this.currentProfileValue = profile;
  }

  public get currentProfile(): LoggedInUserProfile {
    return this.currentProfileValue;
  }

  public hasClaim(claimType: ClaimType, value: string): boolean {
    return (
      this.currentProfileValue &&
      this.currentProfileValue.claims.findIndex(
        // eslint-disable-next-line eqeqeq
        (c) => c.claimType === claimType && c.claimValue == value
      ) >= 0
    );
  }
}
