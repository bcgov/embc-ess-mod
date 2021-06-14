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
          const communities = this.locationsService.getCommunityList();
          const countries = this.locationsService.getCountriesList();
          const registrants = searchResult.registrants;
          for (const registrant of registrants) {
            const community = communities.find(
              (comm) => comm.code === registrant.primaryAddress.communityCode
            );
            const country = countries.find(
              (coun) => coun.code === registrant.primaryAddress.countryCode
            );
            const addressModel: AddressModel = {
              community,
              country
            };
            registrant.primaryAddress = {
              ...addressModel,
              ...registrant.primaryAddress
            };
          }

          return searchResult;
        })
      );
  }
}
