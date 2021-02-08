import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { NeedsAssessment } from '../api/models/needs-assessment';
import { ProfileDataConflict } from '../api/models/profile-data-conflict';
import { Registration } from '../api/models/registration';
import { RegistrationResult } from '../api/models/registration-result';

@Injectable({ providedIn: 'root' })
export class DataService {

    private registrationDetails: Partial<Registration> = {};
    private preliminaryNeedsAssessment: Partial<NeedsAssessment> = {};
    private registrationResult: RegistrationResult;
    private conflicts: Array<ProfileDataConflict>;
    private profileId: string;
    private contactGuidId: string;
    private loginStatus: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public loginStatus$: Observable<boolean> = this.loginStatus.asObservable();

    public setProfileId(profileId: string): void {
        this.profileId = profileId;
    }

    public getProfileId(): string {
        return this.profileId;
    }

    public setContactGuidId(contactId: string): void {
        this.contactGuidId = contactId;
    }

    public getContactGuidId(): string {
        return this.contactGuidId;
    }

    public setLoginStatus(status: boolean): void {
        this.loginStatus.next(status);
    }

    public getLoginStatus(): Observable<boolean> {
        return this.loginStatus$;
    }

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

    public setConflicts(conflicts: Array<ProfileDataConflict>): void {
        this.conflicts = conflicts;
    }

    public getConflicts(): Array<ProfileDataConflict> {
        return this.conflicts;
    }

    clearData(): void {
        this.registrationDetails = {};
        this.preliminaryNeedsAssessment = {};
        this.registrationResult = {
            referenceNumber: null
        };
        this.conflicts = [];
    }
}
