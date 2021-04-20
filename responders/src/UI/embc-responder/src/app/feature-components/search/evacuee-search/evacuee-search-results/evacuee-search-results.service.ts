import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SearchResults } from 'src/app/core/api/models/search-results';
import { RegistrationsService } from 'src/app/core/api/services';
import { EvacueeDetailsModel } from 'src/app/core/models/evacuee-search-context.model';

@Injectable({
    providedIn: 'root'
})
export class EvacueeSearchResultsService {

    constructor(private registrationService: RegistrationsService) { }

    public searchForEvacuee(evacueeSearchParameters: EvacueeDetailsModel): Observable<SearchResults> {
        return this.registrationService.registrationsSearch({
            firstName: evacueeSearchParameters.firstName, lastName: evacueeSearchParameters.lastName,
            dateOfBirth: evacueeSearchParameters.dateOfBirth
        });
    }

}
