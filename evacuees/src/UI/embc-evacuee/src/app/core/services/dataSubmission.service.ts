import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProblemDetail } from '../model/problemDetail';
import { Registration } from '../model/registration';
import { AnonymousRegistration } from './api/models/anonymous-registration';
import { RegistrationResult } from './api/models/registration-result';
import { RegistrationService } from './api/registration.service';
import { DataService } from './data.service';

@Injectable({ providedIn: 'root' })
export class DataSubmissionService {

    private anonymousRegistration: AnonymousRegistration;
    private profile: Registration;

    constructor(public dataService: DataService, private registrationService: RegistrationService) {}

    submitRegistrationFile(): Observable<RegistrationResult> {
        this.anonymousRegistration = {
          preliminaryNeedsAssessment: this.mergeData({}, this.dataService.getNeedsAssessment()),
            registrationDetails: this.mergeData({}, this.dataService.getRegistration()),
            captcha: 'abc'
        };
        console.log(JSON.stringify(this.anonymousRegistration));
        return this.registrationService.registrationCreate(this.anonymousRegistration);
    }

    submitProfile(): Observable<ProblemDetail> {
        this.profile = this.mergeData({}, this.dataService.getRegistration());
        console.log(JSON.stringify(this.profile));
        return this.registrationService.registrationCreateProfile(this.profile);
    }

    private mergeData(finalValue, incomingValue): any {
        return  {...finalValue, ...incomingValue};
    }
}
