import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Registration } from '../../api/models';
import { UserProfile } from '../../api/models/user-profile';
import { ProfileService } from '../../api/services';
import { DataService } from '../data.service';

@Injectable({ providedIn: 'root' })
export class ProfileApiService {

  private profile: Registration;

  constructor(private profileService: ProfileService, public dataService: DataService) { }

  public getExistingProfile(): Observable<UserProfile> {
    return this.profileService.profileGetProfileConflicts();
  }

  submitProfile(): Observable<string> {
    this.profile = this.mergeData({ isMailingAddressSameAsPrimaryAddress: true }, this.dataService.getRegistration());
    console.log(JSON.stringify(this.profile));
    return this.profileService.profileUpsert({ body: this.profile });
  }

  private mergeData(finalValue, incomingValue): any {
    return { ...finalValue, ...incomingValue };
  }
}
