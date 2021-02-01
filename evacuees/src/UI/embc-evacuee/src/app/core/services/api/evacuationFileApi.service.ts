import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RegistrantEvacuation } from '../../api/models/registrant-evacuation';
import { RegistrationResult } from '../../api/models/registration-result';
import { RegistrationService } from '../../api/services';
import { DataService } from '../data.service';


@Injectable({ providedIn: 'root' })
export class EvacuationFileApiService {

    private registrantEvacuation: RegistrantEvacuation;

    constructor(private registrationService: RegistrationService, public dataService: DataService) { }

    submitEvacuationFile(): Observable<RegistrationResult> {
        this.registrantEvacuation = {
            preliminaryNeedsAssessment: this.mergeData({}, this.dataService.getNeedsAssessment()),
            id: this.dataService.getProfileId()
        };
        console.log(JSON.stringify(this.registrantEvacuation));
        return this.registrationService.registrationCreateEvacuation({ body: this.registrantEvacuation });

    }

    private mergeData(finalValue, incomingValue): any {
        return { ...finalValue, ...incomingValue };
    }

}
