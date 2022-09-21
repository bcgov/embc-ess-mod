import { Injectable } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Profile, ProfileDataConflict } from '../../core/api/models';
import { ProfileDataService } from './profile-data.service';
import { FormCreationService } from '../../core/services/formCreation.service';
import { ConflictManagementService } from '../../sharedModules/components/conflict-management/conflict-management.service';
import { LocationService } from 'src/app/core/services/location.service';
import { RestrictionService } from '../restriction/restriction.service';

@Injectable({ providedIn: 'root' })
export class ProfileMappingService {
  constructor(
    private formCreationService: FormCreationService,
    private profileDataService: ProfileDataService,
    private conflictService: ConflictManagementService,
    private locationService: LocationService,
    private restrictionService: RestrictionService
  ) {}

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
    this.setSecurityQuestions(profile);
  }

  setLoginProfile(profile: Profile): void {
    this.populateFromBCSC(profile);
  }

  populateFromBCSC(profile: Profile): void {
    this.formCreationService
      .getPersonalDetailsForm()
      .pipe(first())
      .subscribe((details) => {
        details.setValue({
          firstName: profile.personalDetails.firstName,
          lastName: profile.personalDetails.lastName,
          dateOfBirth: profile.personalDetails.dateOfBirth,
          preferredName: null,
          initials: null,
          gender: null
        });
      });

    this.profileDataService.primaryAddressDetails =
      this.locationService.getAddressRegFromAddress(profile.primaryAddress);
    this.formCreationService
      .getAddressForm()
      .pipe(first())
      .subscribe((address) => {
        address.setValue({
          address: {
            addressLine1:
              this.profileDataService.primaryAddressDetails?.addressLine1,
            addressLine2:
              this.profileDataService.primaryAddressDetails.addressLine2,
            community: null,
            stateProvince:
              this.profileDataService.primaryAddressDetails.stateProvince,
            country: this.profileDataService.primaryAddressDetails.country,
            postalCode: null
          },
          isBcAddress: this.isBCAddress(profile?.primaryAddress?.stateProvince),
          isNewMailingAddress: null,
          isBcMailingAddress: null,
          mailingAddress: {
            addressLine1: null,
            addressLine2: null,
            community: null,
            stateProvince: null,
            country: null,
            postalCode: null
          }
        });
      });
  }

  private setRestrictionDetails(profile: Profile): void {
    this.formCreationService
      .getRestrictionForm()
      .pipe(first())
      .subscribe((details) => {
        details.setValue({ restrictedAccess: profile.restrictedAccess });
      });
    this.restrictionService.restrictedAccess = profile.restrictedAccess;
  }

  private setPersonalDetails(profile: Profile): void {
    let formGroup: UntypedFormGroup;
    this.formCreationService
      .getPersonalDetailsForm()
      .pipe(first())
      .subscribe((details) => {
        details.setValue({
          ...profile.personalDetails
        });
        formGroup = details;
      });
    this.profileDataService.personalDetails = profile.personalDetails;
  }

  private setAddressDetails(profile: Profile): void {
    let formGroup: UntypedFormGroup;
    this.formCreationService
      .getAddressForm()
      .pipe(first())
      .subscribe((address) => {
        const primaryAddress = this.locationService.getAddressRegFromAddress(
          profile.primaryAddress
        );
        const mailingAddress = this.locationService.getAddressRegFromAddress(
          profile.mailingAddress
        );
        address.setValue({
          address: primaryAddress,
          isBcAddress: this.isBCAddress(profile.primaryAddress.stateProvince),
          isNewMailingAddress: this.isSameMailingAddress(
            profile.isMailingAddressSameAsPrimaryAddress
          ),
          isBcMailingAddress: this.isBCAddress(
            profile.mailingAddress.stateProvince
          ),
          mailingAddress
        });
        formGroup = address;
      });
    this.profileDataService.primaryAddressDetails =
      this.locationService.getAddressRegFromAddress(profile.primaryAddress);
    this.profileDataService.mailingAddressDetails =
      this.locationService.getAddressRegFromAddress(profile.mailingAddress);
  }

  private setContactDetails(profile: Profile): void {
    let formGroup: UntypedFormGroup;

    this.formCreationService
      .getContactDetailsForm()
      .pipe(first())
      .subscribe((contact) => {
        contact.setValue({
          ...profile.contactDetails,
          confirmEmail: profile.contactDetails.email,
          showContacts: this.setShowContactsInfo(
            profile.contactDetails.phone,
            profile.contactDetails.email
          )
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

  private setSecurityQuestions(profile: Profile): void {
    let formGroup: UntypedFormGroup;

    this.formCreationService
      .getSecurityQuestionsForm()
      .pipe(first())
      .subscribe((securityQuestions) => {
        securityQuestions.setValue({
          questions: {
            question1: profile.securityQuestions[0].question,
            answer1: profile.securityQuestions[0].answer,
            question2: profile.securityQuestions[1].question,
            answer2: profile.securityQuestions[1].answer,
            question3: profile.securityQuestions[2].question,
            answer3: profile.securityQuestions[2].answer
          }
        });
        formGroup = securityQuestions;
      });
    this.profileDataService.securityQuestions = profile.securityQuestions;
  }

  private isSameMailingAddress(
    isMailingAddressSameAsPrimaryAddress: boolean
  ): string {
    return isMailingAddressSameAsPrimaryAddress === true ? 'Yes' : 'No';
  }

  private isBCAddress(province: null | string): string {
    return province !== null && province === 'BC' ? 'Yes' : 'No';
  }
}
