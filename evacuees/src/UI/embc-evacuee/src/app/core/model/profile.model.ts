import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { CustomValidationService } from '../services/customValidation.service';
import { RegAddress } from './address';
import { LocationModel } from './location.model';

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

export class Secret {
    secretPhrase: string;

    constructor() { }
}

export class SecretForm {
    secretPhrase = new FormControl();

    constructor(secret: Secret) {
        this.secretPhrase.setValue(secret.secretPhrase);
        this.secretPhrase.setValidators([Validators.required]);
    }
}

export class Address {
    isBcAddress: string;
    address: RegAddress;
    mailingAddress: RegAddress;
    isNewMailingAddress: string;
    isBcMailingAddress: string;

    constructor() { }
}

export class AddressForm {
    address: FormGroup;
    isBcAddress = new FormControl();
    isNewMailingAddress = new FormControl();
    isBcMailingAddress = new FormControl();
    mailingAddress: FormGroup;

    constructor(address: Address, builder: FormBuilder, customValidator: CustomValidationService) {
        this.address = builder.group({
            addressLine1: ['', [Validators.required]],
            addressLine2: [''],
            jurisdiction: ['', [Validators.required]],
            stateProvince: ['', [Validators.required]],
            country: ['', [Validators.required]],
            postalCode: ['', [Validators.required, customValidator.postalValidation().bind(customValidator)]]
        });
        this.mailingAddress = builder.group({
            addressLine1: ['', [Validators.required]],
            addressLine2: [''],
            jurisdiction: ['', [Validators.required]],
            stateProvince: ['', [Validators.required]],
            country: ['', [Validators.required]],
            postalCode: ['', [Validators.required, customValidator.postalValidation().bind(customValidator)]]
        });

        this.isBcAddress.setValue(address.isBcAddress);
        this.isBcAddress.setValidators([Validators.required]);

        this.isNewMailingAddress.setValue(address.isNewMailingAddress);
        this.isNewMailingAddress.setValidators([Validators.required]);

        this.isBcMailingAddress.setValue(address.isBcMailingAddress);
        this.isBcMailingAddress.setValidators([customValidator.conditionalValidation(
            () => this.isNewMailingAddress.value === 'No',
            Validators.required
        ).bind(customValidator)]);
    }

    compareObjects<T extends LocationModel>(c1: T, c2: T): boolean {
        if (c1 === null || c2 === null || c1 === undefined || c2 === undefined) {
            return null;
        }
        return c1.code === c2.code;
    }
}
