import {
  UntypedFormControl,
  Validators,
  UntypedFormBuilder,
  UntypedFormGroup
} from '@angular/forms';
import { CustomValidationService } from '../services/customValidation.service';
import { RegAddress } from './address';
import * as globalConst from '../services/globalConstants';
import { Country } from '../services/location.service';

export class Restriction {
  restrictedAccess: boolean;
}

export class RestrictionForm {
  restrictedAccess = new UntypedFormControl();

  constructor(restriction: Restriction) {
    this.restrictedAccess.setValue(restriction.restrictedAccess);
    this.restrictedAccess.setValidators([Validators.required]);
  }
}

export class PersonDetails {
  firstName: string;
  lastName: string;
  preferredName?: string;
  initials?: string;
  gender: string;
  dateOfBirth: string;
  sameLastNameCheck?: boolean;
  isPrimaryRegistrant?: boolean;

  constructor(
    firstName?: string,
    lastName?: string,
    preferredName?: string,
    initials?: string,
    gender?: string,
    dateOfBirth?: string,
    sameLastNameCheck?: boolean,
    isPrimaryRegistrant?: boolean
  ) {}
}

export class PersonDetailsForm {
  firstName = new UntypedFormControl();
  lastName = new UntypedFormControl();
  preferredName = new UntypedFormControl();
  initials = new UntypedFormControl();
  gender = new UntypedFormControl();
  dateOfBirth = new UntypedFormControl();

  constructor(
    personDetail: PersonDetails,
    customValidator: CustomValidationService
  ) {
    if (personDetail.firstName) {
      this.firstName.setValue(personDetail.firstName);
    }

    this.firstName.setValidators([Validators.required]);

    this.lastName.setValue(personDetail.lastName);
    this.lastName.setValidators([Validators.required]);

    this.preferredName.setValue(personDetail.preferredName);

    this.initials.setValue(personDetail.initials);

    this.gender.setValue(personDetail.gender);
    this.gender.setValidators([Validators.required]);

    this.dateOfBirth.setValue(personDetail.dateOfBirth);
    this.dateOfBirth.setValidators([
      Validators.required,
      customValidator.dateOfBirthValidator().bind(customValidator)
    ]);
  }
}

export class ContactDetails {
  email: string;
  phone: string;
  confirmEmail: string;
  showContacts: boolean;
  hideEmailRequired: boolean;
  hidePhoneRequired: boolean;

  constructor() {}
}

export class ContactDetailsForm {
  email = new UntypedFormControl();
  phone = new UntypedFormControl();
  confirmEmail = new UntypedFormControl();
  showContacts = new UntypedFormControl();
  hideEmailRequired = new UntypedFormControl(false);
  hidePhoneRequired = new UntypedFormControl(false);

  constructor(
    contactDetails: ContactDetails,
    customValidator: CustomValidationService
  ) {
    this.showContacts.setValue(contactDetails.showContacts);
    this.showContacts.setValidators([Validators.required]);

    this.email.setValue(contactDetails.email);
    this.email.setValidators([
      Validators.email,
      customValidator
        .conditionalValidation(
          () =>
            (this.phone.value === '' ||
              this.phone.value === undefined ||
              this.phone.value === null) &&
            this.showContacts.value === true,
          Validators.required
        )
        .bind(customValidator)
    ]);

    this.confirmEmail.setValue(contactDetails.confirmEmail);
    this.confirmEmail.setValidators([
      Validators.email,
      customValidator
        .conditionalValidation(
          () =>
            this.email.value !== '' &&
            this.email.value !== undefined &&
            this.email.value !== null &&
            this.showContacts.value === true,
          Validators.required
        )
        .bind(customValidator)
    ]);

    this.phone.setValue(contactDetails.phone);
    this.phone.setValidators([
      customValidator.maskedNumberLengthValidator().bind(customValidator),
      customValidator
        .conditionalValidation(
          () =>
            (this.email.value === '' ||
              this.email.value === undefined ||
              this.email.value === null) &&
            this.showContacts.value === true,
          Validators.required
        )
        .bind(customValidator)
    ]);
  }
}

export class SecurityQuestions {
  question1: string;
  answer1: string;

  question2: string;
  answer2: string;

  question3: string;
  answer3: string;

  constructor() {}
}

export class SecurityQuestionsForm {
  questions: UntypedFormGroup;

  constructor(
    securityQuestions: SecurityQuestions,
    builder: UntypedFormBuilder,
    customValidator: CustomValidationService
  ) {
    this.questions = builder.group(
      {
        question1: [securityQuestions.question1 ?? '', [Validators.required]],
        answer1: [
          securityQuestions.answer1 ?? '',
          [
            Validators.minLength(3),
            Validators.maxLength(50),
            customValidator.whitespaceValidator()
          ]
        ],
        question2: [securityQuestions.question2 ?? '', [Validators.required]],
        answer2: [
          securityQuestions.answer2 ?? '',
          [
            Validators.minLength(3),
            Validators.maxLength(50),
            customValidator.whitespaceValidator()
          ]
        ],
        question3: [securityQuestions.question3 ?? '', [Validators.required]],
        answer3: [
          securityQuestions.answer3 ?? '',
          [
            Validators.minLength(3),
            Validators.maxLength(50),
            customValidator.whitespaceValidator()
          ]
        ]
      },
      {
        validators: [
          customValidator.uniqueValueValidator([
            'question1',
            'question2',
            'question3'
          ])
        ]
      }
    );
  }
}

export class Address {
  isBcAddress: string;
  address: RegAddress;
  mailingAddress: RegAddress;
  isNewMailingAddress: string;
  isBcMailingAddress: string;

  constructor() {}
}

export class AddressForm {
  address: UntypedFormGroup;
  isBcAddress = new UntypedFormControl();
  isNewMailingAddress = new UntypedFormControl();
  isBcMailingAddress = new UntypedFormControl();
  mailingAddress: UntypedFormGroup;

  constructor(
    address: Address,
    builder: UntypedFormBuilder,
    customValidator: CustomValidationService
  ) {
    this.address = builder.group({
      addressLine1: ['', [Validators.required]],
      addressLine2: [''],
      community: ['', [Validators.required]],
      stateProvince: [
        '',
        [
          customValidator
            .conditionalValidation(
              () =>
                this.address.get('country').value !== null &&
                (this.compareObjects(
                  this.address.get('country').value,
                  globalConst.defaultCountry
                ) ||
                  this.compareObjects(
                    this.address.get('country').value,
                    globalConst.usDefaultObject
                  )),
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      country: ['', [Validators.required]],
      postalCode: [
        '',
        [customValidator.postalValidation().bind(customValidator)]
      ]
    });

    this.mailingAddress = builder.group({
      addressLine1: ['', [Validators.required]],
      addressLine2: [''],
      community: ['', [Validators.required]],
      stateProvince: [
        '',
        [
          customValidator
            .conditionalValidation(
              () =>
                this.mailingAddress.get('country').value !== null &&
                (this.compareObjects(
                  this.mailingAddress.get('country').value,
                  globalConst.defaultCountry
                ) ||
                  this.compareObjects(
                    this.mailingAddress.get('country').value,
                    globalConst.usDefaultObject
                  )),
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      country: ['', [Validators.required]],
      postalCode: [
        '',
        [customValidator.postalValidation().bind(customValidator)]
      ]
    });

    this.isBcAddress.setValue(address.isBcAddress);
    this.isBcAddress.setValidators([Validators.required]);

    this.isNewMailingAddress.setValue(address.isNewMailingAddress);
    this.isNewMailingAddress.setValidators([Validators.required]);

    this.isBcMailingAddress.setValue(address.isBcMailingAddress);
    this.isBcMailingAddress.setValidators([
      customValidator
        .conditionalValidation(
          () => this.isNewMailingAddress.value === 'No',
          Validators.required
        )
        .bind(customValidator)
    ]);
  }

  compareObjects<T extends Country>(c1: T, c2: T): boolean {
    if (c1 === null || c2 === null || c1 === undefined || c2 === undefined) {
      return null;
    }
    return c1.code === c2.code;
  }
}

// export class Secret {
//   secretPhrase: string;

//   constructor() {}
// }

// export class SecretForm {
//   secretPhrase = new FormControl();

//   constructor(secret: Secret) {
//     this.secretPhrase.setValue(secret.secretPhrase);
//     this.secretPhrase.setValidators([Validators.required]);
//   }
// }
