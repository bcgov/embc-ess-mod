import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { RegistrationsService } from 'src/app/core/api/services';
import { EvacueeProfile } from '../api/models';

@Injectable({
  providedIn: 'root'
})
export class EvacueeProfileService {
  constructor(private registrationsService: RegistrationsService) {}

  /**
   * Insert new profile
   *
   * @returns string[] list of security questions
   */
  public upsertProfile(evacProfile: EvacueeProfile): Observable<string> {
    return this.registrationsService
      .registrationsUpsertRegistrantProfile({ body: evacProfile })
      .pipe(
        map((profileId) => {
          return profileId;
        })
      );
  }
}
