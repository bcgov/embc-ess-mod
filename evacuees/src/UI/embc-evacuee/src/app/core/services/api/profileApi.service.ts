import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { UserProfile } from '../../api/models/user-profile';
import { ProfileService } from '../../api/services';

@Injectable({ providedIn: 'root' })
export class ProfileApiService {

  constructor(private profileService: ProfileService) { }

  public getExistingProfile(): Observable<UserProfile> {
    return this.profileService.profileGetProfileConflicts();
  }
}
