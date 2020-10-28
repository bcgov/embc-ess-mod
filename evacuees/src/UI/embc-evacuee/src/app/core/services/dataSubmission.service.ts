import { Injectable } from '@angular/core';
import { NeedsAssessment } from '../model/needs-assessment';
import { Registration } from '../model/registration';
import { AnonymousRegistration } from './api/models/anonymous-registration';
import { DataService } from './data.service';

@Injectable({ providedIn: 'root' })
export class DataSubmissionService {

    private anonymousRegistration: AnonymousRegistration;

    constructor(public dataService: DataService) {}

    submitRegistrationFile() {
        this.anonymousRegistration = {
            perliminaryNeedsAssessment: this.mergeData({}, this.dataService.getNeedsAssessment()),
            registrationDetails: this.mergeData({}, this.dataService.getRegistration()),
            captcha: "abc"
        }
        //this.anonymousRegistration.registrationDetails = this.mergeData({}, this.dataService.getRegistration());
        //this.anonymousRegistration.perliminaryNeedsAssessment = this.mergeData({}, this.dataService.getNeedsAssessment());
        console.log(this.anonymousRegistration);
        console.log(JSON.stringify(this.anonymousRegistration))
    }

    private mergeData(finalValue, incomingValue) {
        return  {...finalValue, ...incomingValue};
    }
}
