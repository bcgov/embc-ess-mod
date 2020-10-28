import { Injectable } from '@angular/core';
import { AnonymousRegistration } from './api/models/anonymous-registration';
import { RegistrationService } from './api/registration.service';
import { DataService } from './data.service';

@Injectable({ providedIn: 'root' })
export class DataSubmissionService {

    private anonymousRegistration: AnonymousRegistration;

    constructor(public dataService: DataService, private registrationService: RegistrationService) {}

    submitRegistrationFile() {
        this.anonymousRegistration = {
            perliminaryNeedsAssessment: this.mergeData({}, this.dataService.getNeedsAssessment()),
            registrationDetails: this.mergeData({}, this.dataService.getRegistration()),
            captcha: "abc"
        }
        console.log(JSON.stringify(this.anonymousRegistration))
        this.registrationService.registrationCreate(this.anonymousRegistration).subscribe(result => {
            console.log(result);
        })
    }

    private mergeData(finalValue, incomingValue) {
        return  {...finalValue, ...incomingValue};
    }
}
