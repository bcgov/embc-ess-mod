import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Profile } from '../api/models';
import { NeedsAssessment } from '../api/models/needs-assessment';
import { ProfileDataConflict } from '../api/models/profile-data-conflict';
import { Registration } from '../api/models/registration';
import { RegistrationResult } from '../api/models/registration-result';
import { CacheService } from './cache.service';

@Injectable({ providedIn: 'root' })
export class DataService {

    private registrationDetails: Partial<Registration> = {};
    private preliminaryNeedsAssessment: Partial<NeedsAssessment> = {};
    private registrationResult: RegistrationResult;
    private conflicts: BehaviorSubject<Array<ProfileDataConflict>> = new BehaviorSubject<Array<ProfileDataConflict>>([]);
    public conflicts$: Observable<Array<ProfileDataConflict>> = this.conflicts.asObservable();
    private profileId: string;
    private conflictsResolvedInd: boolean;
    private loginProfile: Profile;
    private profile: Profile;

    constructor(private cacheService: CacheService) { }

    public getProfile(): Profile {
        return this.profile;
    }
    public setProfile(profile: Profile): void {
        this.profile = profile;
        this.cacheService.set('profile', JSON.stringify(profile));
    }

    public getLoginProfile(): Profile {
        return this.loginProfile;
    }
    public setLoginProfile(loginProfile: Profile): void {
        this.loginProfile = loginProfile;
        this.cacheService.set('loginProfile', JSON.stringify(loginProfile));
    }

    public setConflictsResolvedInd(conflictsResolvedInd: boolean): void {
        this.conflictsResolvedInd = conflictsResolvedInd;
    }

    public getConflictsResolvedInd(): boolean {
        return this.conflictsResolvedInd;
    }

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
        this.conflicts.next(conflicts);
    }

    public getConflicts(): Observable<Array<ProfileDataConflict>> {
        return this.conflicts$;
    }

    clearData(): void {
        this.registrationDetails = {};
        this.preliminaryNeedsAssessment = {};
        this.registrationResult = {
            referenceNumber: null
        };
        this.conflicts.next(null);
    }
}
