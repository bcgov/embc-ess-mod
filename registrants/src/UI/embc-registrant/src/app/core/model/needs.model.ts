import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { HouseholdMember } from '../api/models';
import { CustomValidationService } from '../services/customValidation.service';
import { RegAddress } from './address';

export class Evacuated {
  evacuatedFromAddress: RegAddress;
  insurance: string;

  constructor() {}
}

export class EvacuatedForm {
  evacuatedFromPrimary = new UntypedFormControl();
  evacuatedFromAddress: UntypedFormGroup;
  insurance = new UntypedFormControl();

  constructor(
    evacuated: Evacuated,
    builder: UntypedFormBuilder,
    customValidator: CustomValidationService
  ) {
    this.evacuatedFromAddress = builder.group({
      addressLine1: ['', [Validators.required]],
      addressLine2: [''],
      community: ['', [Validators.required]],
      stateProvince: ['', [Validators.required]],
      country: ['', [Validators.required]],
      postalCode: [
        '',
        [customValidator.postalValidation().bind(customValidator)]
      ]
    });

    this.insurance.setValue(evacuated.insurance);
    this.insurance.setValidators([Validators.required]);
  }
}

export class HouseholdMembers {
  householdMembers: Array<HouseholdMember>;

  constructor() {}
}

export class HouseholdMembersForm {
  householdMember: UntypedFormGroup;
  householdMembers = new UntypedFormControl([]);
  addHouseholdMemberIndicator = new UntypedFormControl(false);

  constructor(
    householdMembers: HouseholdMembers,
    customValidator: CustomValidationService,
    builder: UntypedFormBuilder
  ) {
    this.householdMember = builder.group({
      firstName: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addHouseholdMemberIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      lastName: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addHouseholdMemberIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      sameLastNameCheck: [''],
      initials: [''],
      gender: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addHouseholdMemberIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      dateOfBirth: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addHouseholdMemberIndicator.value,
              Validators.required
            )
            .bind(customValidator),
          customValidator
            .conditionalValidation(
              () => this.addHouseholdMemberIndicator.value,
              customValidator.dateOfBirthValidator().bind(customValidator)
            )
            .bind(customValidator)
        ]
      ],
      isPrimaryRegistrant: ['']
    });
  }
}

export class Pet {
  quantity: number;
  type: string;

  constructor() {}
}

export class PetForm {
  pets = new UntypedFormControl([]);
  pet: UntypedFormGroup;
  addPetIndicator = new UntypedFormControl(false);

  constructor(
    pet: Pet,
    customValidator: CustomValidationService,
    builder: UntypedFormBuilder
  ) {
    this.pet = builder.group({
      quantity: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addPetIndicator.value,
              Validators.required
            )
            .bind(customValidator),
          customValidator.quantityPetsValidator().bind(customValidator)
        ]
      ],
      type: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addPetIndicator.value,
              Validators.required, 
            )
            .bind(customValidator),
            customValidator.whitespaceValidator()
        ]
      ]
    });

  }
}

export class IdentifyNeeds {
  canEvacueeProvideClothing: boolean;
  canEvacueeProvideFood: boolean;
  canEvacueeProvideIncidentals: boolean;
  canEvacueeProvideLodging: boolean;
  canEvacueeProvideTransportation: boolean;
}

export class IdentifyNeedsForm {
  canEvacueeProvideClothing = new UntypedFormControl();
  canEvacueeProvideFood = new UntypedFormControl();
  canEvacueeProvideIncidentals = new UntypedFormControl();
  canEvacueeProvideLodging = new UntypedFormControl();
  canEvacueeProvideTransportation = new UntypedFormControl();

  constructor(identifyNeeds: IdentifyNeeds) {
    this.canEvacueeProvideClothing.setValue(
      identifyNeeds.canEvacueeProvideClothing
    );
    this.canEvacueeProvideClothing.setValidators([Validators.required]);

    this.canEvacueeProvideFood.setValue(identifyNeeds.canEvacueeProvideFood);
    this.canEvacueeProvideFood.setValidators([Validators.required]);

    this.canEvacueeProvideIncidentals.setValue(
      identifyNeeds.canEvacueeProvideIncidentals
    );
    this.canEvacueeProvideIncidentals.setValidators([Validators.required]);

    this.canEvacueeProvideLodging.setValue(
      identifyNeeds.canEvacueeProvideLodging
    );
    this.canEvacueeProvideLodging.setValidators([Validators.required]);

    this.canEvacueeProvideTransportation.setValue(
      identifyNeeds.canEvacueeProvideTransportation
    );
    this.canEvacueeProvideTransportation.setValidators([Validators.required]);
  }
}

export class Secret {
  secretPhrase: string;

  constructor() {}
}

export class SecretForm {
  secretPhrase = new UntypedFormControl();

  constructor(secret: Secret) {
    this.secretPhrase.setValue(secret.secretPhrase);
    this.secretPhrase.setValidators([
      Validators.required,
      Validators.minLength(6)
    ]);
  }
}
