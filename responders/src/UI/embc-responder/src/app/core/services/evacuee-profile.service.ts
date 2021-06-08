import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RegistrationsService } from 'src/app/core/api/services';
import { RegistrantProfile, RegistrationResult } from '../api/models';
import { CacheService } from './cache.service';

@Injectable({
  providedIn: 'root'
})
export class EvacueeProfileService {
  private cachedProfileId: string;

  constructor(
    private registrationsService: RegistrationsService,
    private cacheService: CacheService
  ) {}

  /**
   * Fetch profile record from API
   *
   * @returns profile record
   */
  public getProfileFromId(profileId: string): Observable<RegistrantProfile> {
    return this.registrationsService
      .registrationsGetRegistrantProfile({ registrantId: profileId })
      .pipe(
        map((profile) => {
          return profile;
        })
      );
  }

  /**
   * Insert new profile
   *
   * @param regProfile Registrant Profile data to send to API
   *
   * @returns profile id
   */
  public createProfile(
    regProfile: RegistrantProfile
  ): Observable<RegistrationResult> {
    return this.registrationsService
      .registrationsCreateRegistrantProfile({ body: regProfile })
      .pipe(
        map((result) => {
          return result;
        })
      );
  }

  /**
   * Update existing profile
   *
   * @param registrantId ID of Registrant Profile to update
   * @param regProfile Registrant Profile data to send to API
   *
   * @returns profile id
   */
  public updateProfile(
    registrantId: string,
    regProfile: RegistrantProfile
  ): Observable<RegistrationResult> {
    return this.registrationsService
      .registrationsUpdateRegistrantProfile({
        registrantId,
        body: regProfile
      })
      .pipe(
        map((result) => {
          return result;
        })
      );
  }

  /**
   * Get Profile ID currently stored in cache.
   */
  public getCurrentProfileId() {
    return this.cachedProfileId
      ? this.cachedProfileId
      : JSON.parse(this.cacheService.get('profileId'));
  }

  /**
   * Store a Profile ID in the cache.
   *
   * @param id ID to store in cache
   */
  public setCurrentProfileId(id: string) {
    this.cacheService.set('profileId', id);
    this.cachedProfileId = id;
  }

  /**
   * Remove "profileId" from cache
   */
  public clearCurrentProfileId(): void {
    this.cacheService.remove('profileId');
  }
}
