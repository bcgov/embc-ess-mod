import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, mergeMap, withLatestFrom } from 'rxjs/operators';
import { RegistrationsService } from 'src/app/core/api/services';
import {
  EvacuationFileSearchResult,
  EvacuationFileSummary,
  RegistrantProfile,
  RegistrationResult
} from '../api/models';
import { EvacuationFileSearchResultModel } from '../models/evacuation-file-search-result.model';
import { EvacuationFileSummaryModel } from '../models/evacuation-file-summary.model';
import { FileLinkRequestModel } from '../models/fileLinkRequest.model';
import { RegistrantProfileModel } from '../models/registrant-profile.model';
import { EvacueeSessionService } from './evacuee-session.service';
import { LocationsService } from './locations.service';

@Injectable({
  providedIn: 'root'
})
export class EvacueeProfileService {
  constructor(
    private registrationsService: RegistrationsService,
    private locationsService: LocationsService,
    public evacueeSessionService: EvacueeSessionService
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
        map((profile: RegistrantProfile): RegistrantProfileModel => {
          return {
            ...profile,
            primaryAddress: this.locationsService.getAddressModelFromAddress(
              profile.primaryAddress
            ),
            mailingAddress: this.locationsService.getAddressModelFromAddress(
              profile.mailingAddress
            )
          };
        })
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

  /**
   *
   * @param registrantId ID of Registrant Profile to set the verification flag
   * @param verified boolean response to set
   * @returns API profile mapped as EvacueeProfile
   */
  public setVerifiedStatus(
    registrantId: string,
    verified: boolean
  ): Observable<RegistrantProfileModel> {
    return this.registrationsService
      .registrationsSetRegistrantVerified({
        registrantId,
        verified
      })
      .pipe(
        mergeMap((regResult: RegistrationResult) =>
          this.getProfileFromId(regResult.id)
        )
      );
  }

  /**
   *
   * @param registrantId ID of Registrant Profile
   * @returns an Array of matched ESS Files with the Registrant ID
   */
  public getProfileFiles(
    registrantId?: string,
    externalReferenceId?: string
  ): Observable<Array<EvacuationFileSummaryModel>> {
    const evacFileSummaryModelArray: Array<EvacuationFileSummaryModel> = [];
    return this.registrationsService
      .registrationsGetFiles({
        registrantId,
        externalReferenceId
      })
      .pipe(
        map(
          (
            response: Array<EvacuationFileSummary>
          ): Array<EvacuationFileSummaryModel> => {
            console.log(response);
            if (response[0] !== null) {
              response.forEach((item) => {
                const evacFileSummary: EvacuationFileSummaryModel = {
                  ...item,
                  evacuatedFromAddress:
                    this.locationsService.getAddressModelFromAddress(
                      item.evacuatedFromAddress
                    )
                };
                evacFileSummaryModelArray.push(evacFileSummary);
              });
            }
            return evacFileSummaryModelArray;
          }
        )
      );
  }

  public linkMemberProfile(fileLinkMetData: FileLinkRequestModel) {
    return this.registrationsService.registrationsLinkRegistrantToHouseholdMember(
      { fileId: fileLinkMetData.fileId, body: fileLinkMetData.linkRequest }
    );
  }

  public createMemberRegistration(
    regProfile: RegistrantProfile,
    memberId: string,
    essFileId: string
  ): Observable<void> {
    const profile$ =
      this.registrationsService.registrationsCreateRegistrantProfile({
        body: regProfile
      });
    const $result = profile$.pipe(
      mergeMap((regResult) =>
        this.linkMemberProfile({
          fileId: essFileId,
          linkRequest: {
            householdMemberId: memberId,
            registantId: regResult.id
          }
        })
      ),
      withLatestFrom(profile$),
      map(([blob, regResult]) => {
        this.evacueeSessionService.profileId = regResult.id;
      })
    );
    return $result;
  }

  /**
   *
   * @param firstName first Name of the Evacuee
   * @param lastName last Name of the Evacuee
   * @param dateOfBirth date of birth of the Evacuee
   * @returns an array of possible ESS File matches related to this evacuee
   */
  public getFileMatches(
    firstName: string,
    lastName: string,
    dateOfBirth: string
  ): Observable<Array<EvacuationFileSearchResultModel>> {
    const evacFileSearchResultsModelArray: Array<EvacuationFileSearchResultModel> =
      [];
    return this.registrationsService
      .registrationsSearchMatchingEvacuationFiles({
        firstName,
        lastName,
        dateOfBirth
      })
      .pipe(
        map(
          (
            response: Array<EvacuationFileSearchResult>
          ): Array<EvacuationFileSearchResultModel> => {
            response.forEach((item) => {
              const evacFileSearchResult: EvacuationFileSearchResultModel = {
                ...item,
                evacuatedFromAddress:
                  this.locationsService.getAddressModelFromAddress(
                    item.evacuatedFrom
                  )
              };
              evacFileSearchResultsModelArray.push(evacFileSearchResult);
            });
            return evacFileSearchResultsModelArray;
          }
        )
      );
  }
}
