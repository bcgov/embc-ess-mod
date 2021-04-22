import { Injectable } from '@angular/core';
import { UpdateUserProfileRequest, UserProfile } from 'src/app/core/api/models';

@Injectable({ providedIn: 'root' })

export class UserProfileService {


    private firstName: string;
    private lastName: string;
    private email: string;
    private phone: string;

    private id: string;
    private teamId: string;
    private userName: string;
    private teamName: string;
    private role: string;
    private optionalLabel: string;
    private lastLoginDate: string;
    private requiredToSignAgreement: boolean;

    public getFirstName(): string {
        return this.firstName;
    }
    public setFirstName(value: string): void {
        this.firstName = value;
    }

    public getLastName(): string {
        return this.lastName;
    }
    public setLastName(value: string): void {
        this.lastName = value;
    }

    public getEmail(): string {
        return this.email;
    }
    public setEmail(value: string): void {
        this.email = value;
    }

    public getPhone(): string {
        return this.phone;
    }
    public setPhone(value: string): void {
        this.phone = value;
    }

    public setUserProfile(value: UserProfile): void {
        this.id = value.id;
        this.firstName = value.firstName;
        this.lastName = value.lastName;
        this.phone = value.phone;
        this.email = value.email;
        this.requiredToSignAgreement = value.requiredToSignAgreement;
        this.role = value.role;
        this.userName = value.userName;
        this.teamId = value.teamId;
        this.teamName = value.teamName;
        this.lastLoginDate = value.lastLoginDate;
    }

    public getUserProfile(): UserProfile {
        return {
            email: this.email,
            firstName: this.firstName,
            id: this.id,
            lastLoginDate: this.lastLoginDate,
            lastName: this.lastName,
            phone: this.phone,
            requiredToSignAgreement: this.requiredToSignAgreement,
            role: this.role,
            teamId: this.teamId,
            teamName: this.teamName,
            userName: this.userName
            };
    }

    public createUpdateUserProfileDTO(): UpdateUserProfileRequest {
        return {
            email: this.email,
            firstName: this.firstName,
            lastName: this.lastName,
            phone: this.phone
        };
    }
}
