import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Profile, UserProfile } from '../../../core/api/models';
import { ProfileService as Service } from '../../../core/api/services/profile.service';
import { ProfileMappingService } from './profile-mapping.service';

@Injectable({ providedIn: 'root' })
export class ProfileService {

    constructor(private profileService: Service, private profileMapping: ProfileMappingService) { }

    public getExistingProfile(): Observable<UserProfile> {
        return this.profileService.profileGetProfileConflicts();
    }

    upsertProfile(updatedProfile: Profile): Observable<string> {
        return this.profileService.profileUpsert({ body: updatedProfile }).pipe(
            mergeMap(id => this.profileService.profileGetProfile()),
            map(profile => {
                this.profileMapping.mapProfile(profile);
                return profile.id;
            })
        );
    }

}
