import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Registration } from '../api/models/registration';
import { AnonymousRegistration } from '../api/models/anonymous-registration';
import { RegistrationResult } from '../api/models/registration-result';
import { RegistrationService } from '../api/services/registration.service';
import { ProfileService } from '../api/services/profile.service';
import { DataService } from './data.service';
import { RegistrantEvacuation } from '../api/models';

@Injectable({ providedIn: 'root' })
export class DataSubmissionService {

    private anonymousRegistration: AnonymousRegistration;
    private profile: Registration;
    private registrantEvacuation: RegistrantEvacuation;

    constructor(
        public dataService: DataService, private registrationService: RegistrationService, private profileService: ProfileService) { }

    submitRegistrationFile(): Observable<RegistrationResult> {
        this.anonymousRegistration = {
            preliminaryNeedsAssessment: this.mergeData({}, this.dataService.getNeedsAssessment()),
            registrationDetails: this.mergeData({}, this.dataService.getRegistration()),
            captcha: 'abc'
        };
        console.log(JSON.stringify(this.anonymousRegistration));
        return this.registrationService.registrationCreate({ body: this.anonymousRegistration });
    }

    private mergeData(finalValue, incomingValue): any {
        return { ...finalValue, ...incomingValue };
    }
}
