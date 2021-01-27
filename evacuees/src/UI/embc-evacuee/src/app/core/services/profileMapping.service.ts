import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Profile, StateProvince } from '../api/models';
import { UserProfile } from '../api/models/user-profile';
import { DataService } from './data.service';
import { FormCreationService } from './formCreation.service';

@Injectable({ providedIn: 'root' })
export class ProfileMappingService {
    constructor(private formCreationService: FormCreationService, private dataService: DataService, private builder: FormBuilder) { }

    mapUserProfile(userProfile: UserProfile): void {
        this.dataService.setConflicts(userProfile.conflicts);
        if (userProfile.isNewUser) {
            console.log('login');
            this.setLoginUserProfile(userProfile.loginProfile);
        } else {
            console.log('era');
            this.setExistingUserProfile(userProfile.eraProfile);
        }
        sessionStorage.setItem('eraProfile', JSON.stringify(userProfile.eraProfile));
        sessionStorage.setItem('loginProfile', JSON.stringify(userProfile.loginProfile));
    }

    setExistingUserProfile(profile: Profile): void {
        this.setRestrictionDetails(profile);
        this.setPersonalDetails(profile);
        this.setAddressDetails(profile);
        this.setContactDetails(profile);
        this.setSecretDetails(profile);
    }

    setLoginUserProfile(profile: Profile): void {
        this.populateFromBCSC(profile);
    }

    private setRestrictionDetails(profile: Profile): void {
        this.formCreationService.getRestrictionForm().pipe(
            first()).subscribe(details => {
                details.setValue({ restrictedAccess: profile.restrictedAccess });
            });
    }

    private setPersonalDetails(profile: Profile): void {
        let formGroup: FormGroup;
        this.formCreationService.getPeronalDetailsForm().pipe(
            first()).subscribe(details => {
                details.setValue({ ...profile.personalDetails });
                formGroup = details;
            });
        this.formCreationService.setPersonDetailsForm(formGroup);
    }

    private setAddressDetails(profile: Profile): void {
        let formGroup: FormGroup;
        this.formCreationService.getAddressForm().pipe(
            first()).subscribe(address => {
                address.setValue({
                    address: profile.primaryAddress,
                    isBcAddress: this.isBCAddress(profile.primaryAddress.stateProvince),
                    isNewMailingAddress: this.isSameMailingAddress(profile.isMailingAddressSameAsPrimaryAddress),
                    isBcMailingAddress: this.isBCAddress(profile.mailingAddress.stateProvince),
                    mailingAddress: profile.mailingAddress
                });
                formGroup = address;
            });
        this.formCreationService.setAddressForm(formGroup);
    }

    private setContactDetails(profile: Profile): void {
        let formGroup: FormGroup;
        this.formCreationService.getContactDetailsForm().pipe(
            first()).subscribe(contact => {
                contact.setValue({ ...profile.contactDetails, confirmEmail: profile.contactDetails.email });
                formGroup = contact;
            });
        this.formCreationService.setContactDetailsForm(formGroup);
    }

    private setSecretDetails(profile: Profile): void {
        let formGroup: FormGroup;
        this.formCreationService.getSecretForm().pipe(
            first()).subscribe(secret => {
                secret.setValue({ secretPhrase: profile.secretPhrase });
                formGroup = secret;
            });
        this.formCreationService.setSecretForm(formGroup);
    }

    private isSameMailingAddress(isMailingAddressSameAsPrimaryAddress: boolean): string {
        return isMailingAddressSameAsPrimaryAddress === true ? 'Yes' : 'No';
    }

    private isBCAddress(province: null | StateProvince): string {
        return province.code !== null && province.code === 'BC' ? 'Yes' : 'No';
    }

    populateFromBCSC(profile: Profile): void {
        this.formCreationService.getPeronalDetailsForm().pipe(
            first()).subscribe(details => {
                details.setValue({
                    firstName: profile.personalDetails.firstName,
                    lastName: profile.personalDetails.lastName,
                    dateOfBirth: profile.personalDetails.dateOfBirth,
                    preferredName: null,
                    initials: null,
                    gender: null
                });
            });

        this.formCreationService.getAddressForm().pipe(
            first()).subscribe(address => {
                address.setValue({
                    address: profile.primaryAddress,
                    isBcAddress: this.isBCAddress(profile.primaryAddress.stateProvince),
                    isNewMailingAddress: null,
                    isBcMailingAddress: null,
                    mailingAddress: profile.primaryAddress
                });
            });
    }
}
