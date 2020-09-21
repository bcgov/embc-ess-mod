import { FormControl, Validators } from '@angular/forms';
import * as globalConst from '../services/globalConstants';
import { CustomValidationService } from '../services/customValidation.service';

export class PersonDetails {
    firstName: string;
    lastName: string;
    preferredName: string;
    initials: string;
    gender: string;
    dateOfBirth: string;

    constructor() { }
}

export class PersonDetailsForm {

    firstName = new FormControl();
    lastName = new FormControl();
    preferredName = new FormControl();
    initials = new FormControl();
    gender = new FormControl();
    dateOfBirth = new FormControl();

    constructor(personDetail: PersonDetails, customValidator: CustomValidationService) {
        this.firstName.setValue(personDetail.firstName);
        this.firstName.setValidators([Validators.required]);

        this.lastName.setValue(personDetail.lastName);
        this.lastName.setValidators([Validators.required]);

        this.preferredName.setValue(personDetail.preferredName);

        this.initials.setValue(personDetail.initials);

        this.gender.setValue(personDetail.gender);
        this.gender.setValidators([Validators.required]);

        this.dateOfBirth.setValue(personDetail.dateOfBirth);
        this.dateOfBirth.setValidators([Validators.required, customValidator.dateOfBirthValidator().bind(customValidator)]);
        // Validators.pattern(globalConst.datePattern),
    }
}

export class ContactDetails {
    email: string;
    phone: string;
    hidePhoneRequired = false;
    hideEmailRequired = false;
    confirmEmail: string;

    constructor() { }
}

export class ContactDetailsForm {

    email = new FormControl();
    phone = new FormControl();
    hidePhoneRequired = new FormControl();
    hideEmailRequired = new FormControl();
    confirmEmail = new FormControl();

    constructor(contactDetails: ContactDetails, customValidator: CustomValidationService) {

        this.hideEmailRequired.setValue(contactDetails.hideEmailRequired);
        this.hidePhoneRequired.setValue(contactDetails.hidePhoneRequired);

        this.email.setValue(contactDetails.email);
        this.email.setValidators([Validators.required, Validators.email]);

        this.confirmEmail.setValue(contactDetails.confirmEmail);
        this.confirmEmail.setValidators([Validators.required, Validators.email,
        customValidator.confirmEmailValidator().bind(customValidator)]);

        this.phone.setValue(contactDetails.phone);
        this.phone.setValidators([Validators.required, Validators.minLength(12)]);
    }
}
