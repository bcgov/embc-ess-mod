import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Registration } from '../http/api/models/registration';
import { AnonymousRegistration } from '../http/api/models/anonymous-registration';
import { RegistrationResult } from '../http/api/models/registration-result';
import { RegistrationService } from '../http/api/services/registration.service';
import { DataService } from './data.service';

@Injectable({ providedIn: 'root' })
export class DataSubmissionService {

    private anonymousRegistration: AnonymousRegistration;
    private profile: Registration;

    constructor(public dataService: DataService, private registrationService: RegistrationService) { }

    submitRegistrationFile(): Observable<RegistrationResult> {
        this.anonymousRegistration = {
            preliminaryNeedsAssessment: this.mergeData({}, this.dataService.getNeedsAssessment()),
            registrationDetails: this.mergeData({}, this.dataService.getRegistration()),
            captcha: 'abc'
        };
        console.log(JSON.stringify(this.anonymousRegistration));
        return this.registrationService.registrationCreate({ body: this.anonymousRegistration });
    }

    submitProfile(): Observable<void> {
        this.profile = this.mergeData({}, this.dataService.getRegistration());
        console.log(JSON.stringify(this.profile));
        return this.registrationService.registrationCreateProfile({ body: this.profile });
    }

    private mergeData(finalValue, incomingValue): any {
        return { ...finalValue, ...incomingValue };
    }
}
