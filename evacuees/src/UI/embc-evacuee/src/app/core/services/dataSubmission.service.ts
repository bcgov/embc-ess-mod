import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AnonymousRegistration } from './api/models/anonymous-registration';
import { RegistrationResult } from './api/models/registration-result';
import { RegistrationService } from './api/registration.service';
import { DataService } from './data.service';

@Injectable({ providedIn: 'root' })
export class DataSubmissionService {

    private anonymousRegistration: AnonymousRegistration;

    constructor(public dataService: DataService, private registrationService: RegistrationService) {}

    submitRegistrationFile(): Observable<RegistrationResult> {
        this.anonymousRegistration = {
            perliminaryNeedsAssessment: this.mergeData({}, this.dataService.getNeedsAssessment()),
            registrationDetails: this.mergeData({}, this.dataService.getRegistration()),
            captcha: 'abc'
        };
        console.log(JSON.stringify(this.anonymousRegistration));
        return this.registrationService.registrationCreate(this.anonymousRegistration);
    }

    private mergeData(finalValue, incomingValue): any {
        return  {...finalValue, ...incomingValue};
    }
}
