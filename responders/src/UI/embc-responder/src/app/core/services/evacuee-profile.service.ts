import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { RegistrationsService } from 'src/app/core/api/services';
import { RegistrantProfile, RegistrationResult } from '../api/models';
import { RegistrantProfileModel } from '../models/registrant-profile.model';
import { LocationsService } from './locations.service';

@Injectable({
  providedIn: 'root'
})
export class EvacueeProfileService {
  constructor(
    private registrationsService: RegistrationsService,
    private locationsService: LocationsService
  ) {}

  /**
   * Fetches profile record from API and maps the location codes
   * to description
   *
   * @returns profile record
   */
  public getProfileFromId(
    profileId: string
  ): Observable<RegistrantProfileModel> {
    return this.registrationsService
      .registrationsGetRegistrantProfile({
        registrantId: profileId
      })
      .pipe(
        map(
          (profile: RegistrantProfile): RegistrantProfileModel => {
            return {
              ...profile,
              primaryAddress: this.locationsService.getAddressModelFromAddress(
                profile.primaryAddress
              ),
              mailingAddress: this.locationsService.getAddressModelFromAddress(
                profile.mailingAddress
              )
            };
          }
        )
      );
  }

  /**
   * Create new profile and fetches the created profile
   *
   * @param regProfile Registrant Profile data to send to API
   *
   * @returns API profile mapped as EvacueeProfile
   */
  public createProfile(
    regProfile: RegistrantProfile
  ): Observable<RegistrantProfileModel> {
    return this.registrationsService
      .registrationsCreateRegistrantProfile({ body: regProfile })
      .pipe(
        mergeMap((regResult: RegistrationResult) =>
          this.getProfileFromId(regResult.id)
        )
      );
  }

  /**
   * Update existing profile
   *
   * @param registrantId ID of Registrant Profile to update
   * @param regProfile Registrant Profile data to send to API
   *
   * @returns API profile mapped as EvacueeProfile
   */
  public updateProfile(
    registrantId: string,
    regProfile: RegistrantProfile
  ): Observable<RegistrantProfileModel> {
    return this.registrationsService
      .registrationsUpdateRegistrantProfile({
        registrantId,
        body: regProfile
      })
      .pipe(
        mergeMap((regResult: RegistrationResult) =>
          this.getProfileFromId(regResult.id)
        )
      );
  }
}
