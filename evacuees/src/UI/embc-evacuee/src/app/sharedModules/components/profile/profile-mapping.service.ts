import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Profile, ProfileDataConflict, StateProvince } from '../../../core/api/models';
import { ProfileDataService } from './profile-data.service';
import { FormCreationService } from '../../../core/services/formCreation.service';
import { DataService } from 'src/app/core/services/data.service';
import { ConflictManagementService } from '../conflict-management/conflict-management.service';

@Injectable({ providedIn: 'root' })
export class ProfileMappingService {
    constructor(
        private formCreationService: FormCreationService, private profileDataService: ProfileDataService,
        private conflictService: ConflictManagementService, private dataService: DataService) { }

    mapProfile(profile: Profile): void {
        this.profileDataService.setProfileId(profile.id);
        this.profileDataService.setProfile(profile);
        this.setExistingProfile(profile);
    }

    mapLoginProfile(profile: Profile): void {
        this.setLoginProfile(profile);
        this.profileDataService.setLoginProfile(profile);
    }

    mapConflicts(conflicts: ProfileDataConflict[]): void {
        this.conflictService.setConflicts(conflicts);
        this.conflictService.setCount(conflicts.length);
        this.conflictService.setHasVisitedConflictPage(true);
    }

    setExistingProfile(profile: Profile): void {
        this.setRestrictionDetails(profile);
        this.setPersonalDetails(profile);
        this.setAddressDetails(profile);
        this.setContactDetails(profile);
        this.setSecretDetails(profile);
    }

    setLoginProfile(profile: Profile): void {
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
        this.profileDataService.personalDetails = profile.personalDetails;
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
        this.profileDataService.primaryAddressDetails = profile.primaryAddress;
        this.profileDataService.mailingAddressDetails = profile.mailingAddress;
    }

    private setContactDetails(profile: Profile): void {
        let formGroup: FormGroup;

        this.formCreationService.getContactDetailsForm().pipe(
            first()).subscribe(contact => {
                contact.setValue({
                    ...profile.contactDetails, confirmEmail: profile.contactDetails.email,
                    showContacts: this.setShowContactsInfo(profile.contactDetails.phone, profile.contactDetails.email)
                });
                formGroup = contact;
            });
        this.profileDataService.contactDetails = profile.contactDetails;
    }

    private setShowContactsInfo(phoneNumber: string, email: string): boolean {
        if (phoneNumber != null || email != null) {
            return true;
        } else {
            return false;
        }
    }

    private setSecretDetails(profile: Profile): void {
        let formGroup: FormGroup;
        this.formCreationService.getSecretForm().pipe(
            first()).subscribe(secret => {
                secret.setValue({ secretPhrase: profile.secretPhrase });
                formGroup = secret;
            });
        this.profileDataService.secretWordPhrase = profile.secretPhrase;
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
