import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RegistrationsService } from 'src/app/core/api/services';
import { AddressModel } from 'src/app/core/models/address.model';
import { EvacueeDetailsModel } from 'src/app/core/models/evacuee-search-context.model';
import { EvacueeSearchResults } from 'src/app/core/models/evacuee-search-results';
import { LocationsService } from 'src/app/core/services/locations.service';

@Injectable({
  providedIn: 'root'
})
export class EvacueeSearchResultsService {
  constructor(
    private registrationService: RegistrationsService,
    private locationsService: LocationsService
  ) {}

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
    return this.registrationService
      .registrationsSearch({
        firstName: evacueeSearchParameters.firstName,
        lastName: evacueeSearchParameters.lastName,
        dateOfBirth: evacueeSearchParameters.dateOfBirth
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

          return searchResult;
        })
      );
  }

  /**
   * Maps codes to generate names
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
