import { Injectable } from '@angular/core';
import { UserProfile } from '../core/api/models';
import {
  LoggedInUserProfile,
  UserService
} from '../core/services/user.service';

@Injectable({ providedIn: 'root' })
export class MockUserService extends UserService {
  public userProfile: UserProfile;

  private currentProfileValue: LoggedInUserProfile;

  loadUserProfile(): Promise<UserProfile> {
    return Promise.resolve(this.userProfile);
  }

  public get currentProfile(): LoggedInUserProfile {
    return this.currentProfileValue;
  }
}
