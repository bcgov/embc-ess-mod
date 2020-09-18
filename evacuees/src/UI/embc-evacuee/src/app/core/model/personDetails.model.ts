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
