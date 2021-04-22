import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { UserProfile } from 'src/app/core/api/models';
import { ProfileService } from 'src/app/core/api/services';
import { UserProfileService } from '../user-profile.service';

@Injectable({
    providedIn: 'root'
})
export class EditUserProfileService {

    constructor(private userProfileService: UserProfileService, private profileService: ProfileService) { }

    public editUserProfile(): Observable<UserProfile> {
        return this.profileService.profileUpdate({ body:
            this.userProfileService.createUpdateUserProfileDTO()
        }).pipe(
            mergeMap(() => this.getUserProfile()),
            map(profile => {
                console.log(profile);
                this.userProfileService.setUserProfile(profile);
                return profile;
            })
        );
    }

    public getUserProfile(): Observable<UserProfile> {
        return this.profileService.profileGetCurrentUserProfile();
    }

}
