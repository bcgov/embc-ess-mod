import { Injectable } from '@angular/core';
import { Profile } from '../api/models';
import { NeedsAssessment } from '../api/models/needs-assessment';
import { Registration } from '../api/models/registration';
import { RegistrationResult } from '../api/models/registration-result';

@Injectable({ providedIn: 'root' })
export class DataService {

    private registrationDetails: Partial<Registration> = {};
    private preliminaryNeedsAssessment: Partial<NeedsAssessment> = {};
    private registrationResult: RegistrationResult;

    constructor() { }

    public updateRegistartion(value): void {
        this.registrationDetails = { ...this.registrationDetails, ...value };
    }

    public getRegistration(): Partial<Registration> {
        return this.registrationDetails;
    }

    public updateNeedsAssessment(value): void {
        this.preliminaryNeedsAssessment = { ...this.preliminaryNeedsAssessment, ...value };
        console.log(this.preliminaryNeedsAssessment);
    }

    public getNeedsAssessment(): Partial<NeedsAssessment> {
        return this.preliminaryNeedsAssessment;
    }

    public setRegistrationResult(registrationResult: RegistrationResult): void {
        this.registrationResult = registrationResult;
    }

    public getRegistrationResult(): RegistrationResult {
        return this.registrationResult;
    }

    clearData(): void {
        this.registrationDetails = {};
        this.preliminaryNeedsAssessment = {};
        this.registrationResult = {
            referenceNumber: null
        };
    }
}
