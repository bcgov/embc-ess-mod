import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { RegistrationsService } from 'src/app/core/api/services';
import { StepCreateProfileService } from 'src/app/feature-components/wizard/step-create-profile/step-create-profile.service';
import { RegistrantProfile, RegistrationResult } from '../api/models';
import { AddressModel } from '../models/address.model';
import { EvacueeProfile } from '../models/evacuee-profile';
import { LocationsService } from './locations.service';

@Injectable({
  providedIn: 'root'
})
export class EvacueeProfileService {
  constructor(
    private registrationsService: RegistrationsService,
    private stepCreateProfileService: StepCreateProfileService,
    private locationService: LocationsService
  ) {}

  /**
   * Fetches profile record from API and maps the location codes
   * to description
   *
   * @returns profile record
   */
  public getProfileFromId(profileId: string): Observable<EvacueeProfile> {
    return this.registrationsService
      .registrationsGetRegistrantProfile({
        registrantId: profileId
      })
      .pipe(
        map((profile: EvacueeProfile) => {
          const communities = this.locationService.getCommunityList();
          const countries = this.locationService.getCountriesList();
          const stateProvinces = this.locationService.getStateProvinceList();

          const primaryCommunity = communities.find(
            (comm) => comm.code === profile.primaryAddress.communityCode
          );
          const mailingCommunity = communities.find(
            (comm) => comm.code === profile.mailingAddress.communityCode
          );

          const primaryCountry = countries.find(
            (coun) => coun.code === profile.primaryAddress.countryCode
          );

          const mailingCountry = countries.find(
            (coun) => coun.code === profile.mailingAddress.countryCode
          );

          const primaryStateProvince = stateProvinces.find(
            (sp) => sp.code === profile.primaryAddress.stateProvinceCode
          );

          const mailingStateProvince = stateProvinces.find(
            (sp) => sp.code === profile.mailingAddress.stateProvinceCode
          );

          const primaryAddressModel: AddressModel = {
            community: primaryCommunity,
            country: primaryCountry,
            stateProvince: primaryStateProvince
          };
          const mailingAddressModel: AddressModel = {
            community: mailingCommunity,
            country: mailingCountry,
            stateProvince: mailingStateProvince
          };

          profile.primaryAddress = {
            ...primaryAddressModel,
            ...profile.primaryAddress
          };

          profile.mailingAddress = {
            ...mailingAddressModel,
            ...profile.mailingAddress
          };
          this.stepCreateProfileService.getProfileDTO(profile);
          return profile;
        })
      );
  }

  /**
   * Create new profile and fetches the created profile
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
   * @returns profile id
   */
  public updateProfile(
    registrantId: string,
    regProfile: RegistrantProfile
  ): Observable<RegistrationResult> {
    return this.registrationsService.registrationsUpdateRegistrantProfile({
      registrantId,
      body: regProfile
    });
  }
}
