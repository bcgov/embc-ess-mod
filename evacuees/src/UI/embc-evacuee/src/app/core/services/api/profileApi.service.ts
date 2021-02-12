import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProfileService } from '../../api/services';
import { DataService } from '../data.service';

@Injectable({ providedIn: 'root' })
export class ProfileApiService {

  constructor(private profileService: ProfileService, public dataService: DataService) { }

  submitProfile(): Observable<string> {
    const profile = this.mergeData({ isMailingAddressSameAsPrimaryAddress: true },
      this.dataService.getRegistration()); // this is wrong, should accept profile object
    console.log(JSON.stringify(profile));
    return this.profileService.profileUpsert({ body: profile });
  }

  private mergeData(finalValue, incomingValue): any {
    return { ...finalValue, ...incomingValue };
  }

}
