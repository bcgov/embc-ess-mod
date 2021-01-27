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

    submitProfile(): Observable<void> {
        this.profile = this.mergeData({ isMailingAddressSameAsPrimaryAddress: true }, this.dataService.getRegistration());
        console.log(JSON.stringify(this.profile));
        // return this.registrationService.registrationCreateProfile({ body: this.profile });
        return this.profileService.profileUpsert({ body: this.profile });
    }

    submitVerifiedProfile(): void {
        this.profile = this.mergeData({}, this.dataService.getRegistration());
        console.log(JSON.stringify(this.profile));
    }

    submitVerifiedRegistrationFile(): Observable<RegistrationResult> {
        this.registrantEvacuation = {
            preliminaryNeedsAssessment: this.mergeData({}, this.dataService.getNeedsAssessment()),
            // contactId: window.localStorage.getItem('userid')
            contactId: 'TXZESQRHWCVZZT5LXWZLTMR7KEHDR7U4'
        };
        console.log(JSON.stringify(this.registrantEvacuation));
        return this.registrationService.registrationCreateEvacuation({ body: this.registrantEvacuation });

    }

    private mergeData(finalValue, incomingValue): any {
        return { ...finalValue, ...incomingValue };
    }
}
