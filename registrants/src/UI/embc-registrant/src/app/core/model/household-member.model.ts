import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { CustomValidationService } from '../services/customValidation.service';
import { HouseholdMember } from '../api/models';

export class HouseholdMembers {
  householdMembers: Array<HouseholdMember>;
}

export class HouseholdMembersForm {
  householdMember: UntypedFormGroup;
  householdMembers = new UntypedFormControl([]);
  addHouseholdMemberIndicator = new UntypedFormControl(false);

  constructor(customValidator: CustomValidationService, builder: UntypedFormBuilder) {
    this.householdMember = builder.group(new HouseholdMemberForm(new HouseholdMemberModel(), customValidator));
  }
}

export class HouseholdMemberModel {
  firstName: string;
  lastName: string;
  initials?: string;
  gender: string;
  dateOfBirth: string;
  sameLastNameCheck?: boolean;
  isPrimaryRegistrant?: boolean;
  id?: string;
  isMinor: boolean;
  email?: string;
  phone?: string;
}

export class HouseholdMemberForm {
  id = new UntypedFormControl();
  isMinor = new UntypedFormControl();
  isPrimaryRegistrant = new UntypedFormControl();
  sameLastNameCheck = new UntypedFormControl();
  firstName = new UntypedFormControl();
  lastName = new UntypedFormControl();
  initials = new UntypedFormControl();
  gender = new UntypedFormControl();
  dateOfBirth = new UntypedFormControl();
  email = new UntypedFormControl();
  phone = new UntypedFormControl();

  constructor(householdMemberDetails: HouseholdMemberModel, customValidator: CustomValidationService) {
    this.id.setValue(householdMemberDetails.id);
    this.isPrimaryRegistrant.setValue(householdMemberDetails.isPrimaryRegistrant);
    this.isMinor.setValue(householdMemberDetails.isMinor);
    this.sameLastNameCheck.setValue(householdMemberDetails.sameLastNameCheck);

    if (householdMemberDetails.firstName) {
      this.firstName.setValue(householdMemberDetails.firstName);
    }
    this.firstName.setValidators([Validators.required]);

    this.lastName.setValue(householdMemberDetails.lastName);
    this.lastName.setValidators([Validators.required]);

    this.initials.setValue(householdMemberDetails.initials);

    this.gender.setValue(householdMemberDetails.gender);
    this.gender.setValidators([Validators.required]);

    this.dateOfBirth.setValue(householdMemberDetails.dateOfBirth);
    this.dateOfBirth.setValidators([Validators.required, customValidator.dateOfBirthValidator().bind(customValidator)]);

    this.email.setValue(householdMemberDetails.email);
    this.email.setValidators([Validators.email]);

    this.phone.setValue(householdMemberDetails.phone);
    this.phone.setValidators([customValidator.maskedNumberLengthValidator().bind(customValidator)]);
  }
}
