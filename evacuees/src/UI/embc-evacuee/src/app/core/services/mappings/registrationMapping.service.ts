import { Injectable } from '@angular/core';
import { AnonymousRegistration } from '../../api/models';
import { DataService } from '../data.service';

@Injectable({ providedIn: 'root' })
export class RegistrationMappingService {

    constructor(public dataService: DataService) { }

    mapAnonymousRegistration(): AnonymousRegistration {
        return {
            preliminaryNeedsAssessment: this.mergeData({}, this.dataService.getNeedsAssessment()),
            registrationDetails: this.mergeData({}, this.dataService.getRegistration()),
            captcha: 'abc'
        };
    }

    private mergeData(finalValue, incomingValue): any {
        return { ...finalValue, ...incomingValue };
    }
}