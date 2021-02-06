import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Profile } from '../../api/models';
import { UserProfile } from '../../api/models/user-profile';
import { ProfileService } from '../../api/services';
import { DataService } from '../data.service';
import { ProfileMappingService } from '../mappings/profileMapping.service';

@Injectable({ providedIn: 'root' })
export class ProfileApiService {

  constructor(private profileService: ProfileService, public dataService: DataService, private profileMapping: ProfileMappingService) { }

  public getExistingProfile(): Observable<UserProfile> {
    return this.profileService.profileGetProfileConflicts();
  }

  submitProfile(): Observable<string> {
    let profile = this.mergeData({ isMailingAddressSameAsPrimaryAddress: true }, this.dataService.getRegistration()); // this is wrong, should accept profile object
    console.log(JSON.stringify(profile));
    return this.profileService.profileUpsert({ body: profile });
  }

  private mergeData(finalValue, incomingValue): any {
    return { ...finalValue, ...incomingValue };
  }

  upsertProfile(updatedProfile: Profile): Observable<string> {
    return this.profileService.profileUpsert({ body: updatedProfile }).pipe(
      mergeMap(id => this.profileService.profileGetProfile()),
      map(profile => {
        this.profileMapping.mapProfile(profile);
        return profile.id
      })
    )
  }

}
