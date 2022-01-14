import { Injectable } from '@angular/core';
import { UserProfile } from '../core/api/models';
import { UserService } from '../core/services/user.service';

@Injectable({ providedIn: 'root' })
export class MockUserService extends UserService {
  public userProfile: UserProfile;

  loadUserProfile(): Promise<UserProfile> {
    return Promise.resolve(this.userProfile);
  }
}
