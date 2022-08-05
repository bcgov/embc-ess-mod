import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { RegistrationsService } from 'src/app/core/api/services';
import {
  EvacuationFileSearchResult,
  EvacuationFileSummary,
  RegistrantProfile,
  RegistrationResult
} from '../api/models';
import { AddressModel } from '../models/address.model';
import { EvacuationFileSearchResultModel } from '../models/evacuation-file-search-result.model';
import { EvacuationFileSummaryModel } from '../models/evacuation-file-summary.model';
import { EvacueeDetailsModel } from '../models/evacuee-search-context.model';
import { EvacueeSearchResults } from '../models/evacuee-search-results';
import { FileLinkRequestModel } from '../models/fileLinkRequest.model';
import { RegistrantProfileModel } from '../models/registrant-profile.model';
import { ComputeRulesService } from './computeRules.service';
import { EvacueeSessionService } from './evacuee-session.service';
import { AppBaseService } from './helper/appBase.service';
import { LocationsService } from './locations.service';

@Injectable({
  providedIn: 'root'
})
export class EvacueeProfileService {
  constructor(
    private registrationsService: RegistrationsService,
    private locationsService: LocationsService,
    public evacueeSessionService: EvacueeSessionService,
    private appBaseService: AppBaseService,
    private computeState: ComputeRulesService
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
          const profileModel = {
            ...profile,
            primaryAddress: this.locationsService.getAddressModelFromAddress(
              profile.primaryAddress
            ),
            mailingAddress: this.locationsService.getAddressModelFromAddress(
              profile.mailingAddress
            )
          };
          this.appBaseService.appModel = {
            selectedProfile: {
              selectedEvacueeInContext: profileModel,
              householdMemberRegistrantId: undefined
            }
          };
          this.computeState.triggerEvent();
          return profileModel;
        })
      );
  }

  /**
   * Gets the search results from dymanics and maps the results into UI
   * acceptable format
   *
   * @param evacueeSearchParameters profile/ess file search params
   * @returns observable of search results
   */
  public searchForEvacuee(
    evacueeSearchParameters: EvacueeDetailsModel
  ): Observable<EvacueeSearchResults> {
    return this.registrationsService
      .registrationsSearch({
        firstName: evacueeSearchParameters?.firstName,
        lastName: evacueeSearchParameters?.lastName,
        dateOfBirth: evacueeSearchParameters?.dateOfBirth,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        ManualFileId: evacueeSearchParameters?.paperFileNumber
      })
      .pipe(
        map((searchResult: EvacueeSearchResults) => {
          const registrants = searchResult.registrants;
          const essFiles = searchResult.files;
          for (const registrant of registrants) {
            const addressModel: AddressModel = this.mapAddressFields(
              registrant.primaryAddress.communityCode,
              registrant.primaryAddress.countryCode
            );
            const files = registrant.evacuationFiles;

            for (const file of files) {
              const fileAddressModel: AddressModel = this.mapAddressFields(
                file.evacuatedFrom.communityCode,
                file.evacuatedFrom.countryCode
              );

              file.evacuatedFrom = {
                ...fileAddressModel,
                ...file.evacuatedFrom
              };
            }
            registrant.primaryAddress = {
              ...addressModel,
              ...registrant.primaryAddress
            };
          }

          for (const file of essFiles) {
            const fileAddressModel: AddressModel = this.mapAddressFields(
              file.evacuatedFrom.communityCode,
              file.evacuatedFrom.countryCode
            );

            file.evacuatedFrom = {
              ...fileAddressModel,
              ...file.evacuatedFrom
            };
          }

          searchResult?.files?.sort(
            (a, b) =>
              new Date(b.modifiedOn).valueOf() -
              new Date(a.modifiedOn).valueOf()
          );
          searchResult?.registrants?.sort(
            (a, b) =>
              new Date(b.modifiedOn).valueOf() -
              new Date(a.modifiedOn).valueOf()
          );

          return searchResult;
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
    manualFileId?: string,
    id?: string
  ): Observable<Array<EvacuationFileSummaryModel>> {
    const evacFileSummaryModelArray: Array<EvacuationFileSummaryModel> = [];
    return this.registrationsService
      .registrationsGetFiles({
        registrantId,
        manualFileId,
        id
      })
      .pipe(
        map(
          (
            response: Array<EvacuationFileSummary>
          ): Array<EvacuationFileSummaryModel> => {
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
  ): Observable<string> {
    const profile$ =
      this.registrationsService.registrationsCreateRegistrantProfile({
        body: regProfile
      });
    const $result = profile$.pipe(
      mergeMap((regResult: RegistrationResult) => {
        this.evacueeSessionService.newHouseholdRegistrantId = regResult.id;
        //this.setProfileDetails(regResult.id);
        return this.linkMemberProfile({
          fileId: essFileId,
          linkRequest: {
            householdMemberId: memberId,
            registantId: regResult.id
          }
        });
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

  public inviteProfileByEmail(
    email: string,
    registrantId: string
  ): Observable<void> {
    return this.registrationsService.registrationsInviteToRegistrantPortal({
      registrantId,
      body: { email }
    });
  }

  /**
   * Maps codes to generate names:
   *
   * @param communityCode communityCode from api
   * @param countryCode countryCode from api
   * @returns Address object
   */
  private mapAddressFields(
    communityCode: string,
    countryCode: string
  ): AddressModel {
    const communities = this.locationsService.getCommunityList();
    const countries = this.locationsService.getCountriesList();
    const community = communities.find((comm) => comm.code === communityCode);
    const country = countries.find((coun) => coun.code === countryCode);
    return {
      community,
      country
    };
  }
}
