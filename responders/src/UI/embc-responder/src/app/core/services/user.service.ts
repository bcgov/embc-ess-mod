import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { UserProfile } from '../api/models/user-profile';
import { ProfileService } from '../api/services';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private profile?: LoggedInUserProfile = null;

  constructor(private profileService: ProfileService) { }

  public loadUserProfile(): Observable<UserProfile> {
    return this.profileService.profileGetCurrentUserProfile().pipe(tap(response => {
      this.profile = { ...response, taskNumber: null };
    }));
  }

  public get currentProfile(): LoggedInUserProfile {
    return this.profile;
  }

}

export interface LoggedInUserProfile extends UserProfile {
  taskNumber?: string;
}
