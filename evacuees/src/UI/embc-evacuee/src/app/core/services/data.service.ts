import { Injectable } from '@angular/core';
import { NeedsAssessment } from '../model/needs-assessment';
import { Registration } from '../model/registration';

@Injectable({ providedIn: 'root' })
export class DataService {

    private registrationDetails: Partial<Registration> = {};
    private perliminaryNeedsAssessment: Partial<NeedsAssessment> = {};

    public updateRegistartion(value): void {
       this.registrationDetails = { ...this.registrationDetails, ...value};
       console.log(this.registrationDetails);
    }

    public getRegistration(): Partial<Registration> {
        return this.registrationDetails;
    }

    public updateNeedsAssessment(value): void {
        this.perliminaryNeedsAssessment = { ...this.perliminaryNeedsAssessment, ...value};
        console.log(this.perliminaryNeedsAssessment);
    }

    public getNeedsAssessment(): Partial<NeedsAssessment> {
        return this.perliminaryNeedsAssessment;
    }
}
