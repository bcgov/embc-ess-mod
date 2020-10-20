import { Injectable } from '@angular/core';
import { NeedsAssessment } from '../model/needs-assessment';
import { Registration } from '../model/registration';

@Injectable({ providedIn: 'root' })
export class DataService {

    private registration: Partial<Registration> = {};
    private needsAssessment: Partial<NeedsAssessment> = {};

    public updateRegistartion(value): void {
       this.registration = { ...this.registration, ...value};
       console.log(this.registration);
    }

    public getRegistration(): Partial<Registration> {
        return this.registration;
    }

    public updateNeedsAssessment(value): void {
        this.needsAssessment = { ...this.registration, ...value};
        console.log(this.needsAssessment);
    }

    public getNeedsAssessment(): Partial<NeedsAssessment> {
        return this.needsAssessment;
    }
}
