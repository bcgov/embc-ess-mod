import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { HouseholdMember, IdentifiedNeed } from '../api/models';
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

  constructor(evacuated: Evacuated, builder: UntypedFormBuilder, customValidator: CustomValidationService) {
    this.evacuatedFromAddress = builder.group({
      addressLine1: ['', [Validators.required]],
      addressLine2: [''],
      community: ['', [Validators.required]],
      stateProvince: ['', [Validators.required]],
      country: ['', [Validators.required]],
      postalCode: ['', [customValidator.postalValidation().bind(customValidator)]]
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

  constructor(householdMembers: HouseholdMembers, customValidator: CustomValidationService, builder: UntypedFormBuilder) {
    this.householdMember = builder.group({
      firstName: ['', [customValidator.conditionalValidation(() => this.addHouseholdMemberIndicator.value, Validators.required).bind(customValidator)]],
      lastName: ['', [customValidator.conditionalValidation(() => this.addHouseholdMemberIndicator.value, Validators.required).bind(customValidator)]],
      sameLastNameCheck: [''],
      initials: [''],
      gender: ['', [customValidator.conditionalValidation(() => this.addHouseholdMemberIndicator.value, Validators.required).bind(customValidator)]],
      dateOfBirth: [
        '',
        [
          customValidator.conditionalValidation(() => this.addHouseholdMemberIndicator.value, Validators.required).bind(customValidator),
          customValidator.conditionalValidation(() => this.addHouseholdMemberIndicator.value, customValidator.dateOfBirthValidator().bind(customValidator)).bind(customValidator)
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

  constructor(pet: Pet, customValidator: CustomValidationService, builder: UntypedFormBuilder) {
    this.pet = builder.group({
      quantity: [
        '',
        [
          customValidator.conditionalValidation(() => this.addPetIndicator.value, Validators.required).bind(customValidator),
          customValidator.quantityPetsValidator().bind(customValidator)
        ]
      ],
      type: ['', [customValidator.conditionalValidation(() => this.addPetIndicator.value, Validators.required).bind(customValidator)]]
    });
  }
}

export class IdentifyNeeds {
  needs: IdentifiedNeed[] = [];
}

export class IdentifyNeedsForm {
  requiresClothing = new UntypedFormControl();
  requiresFood = new UntypedFormControl();
  requiresIncidentals = new UntypedFormControl();
  requiresShelterType = new UntypedFormControl();
  requiresShelter = new UntypedFormControl();
  requiresNothing = new UntypedFormControl();

  constructor(identifyNeeds: IdentifyNeeds) {
    this.requiresClothing.setValue(identifyNeeds.needs.includes(IdentifiedNeed.Clothing));
    this.requiresFood.setValue(identifyNeeds.needs.includes(IdentifiedNeed.Food));
    this.requiresIncidentals.setValue(identifyNeeds.needs.includes(IdentifiedNeed.Incidentals));
    if (identifyNeeds.needs.includes(IdentifiedNeed.ShelterReferral)) {
      this.requiresShelterType.setValue('shelterReferral');
    } else if (identifyNeeds.needs.includes(IdentifiedNeed.ShelterAllowance)) {
      this.requiresShelterType.setValue('shelterAllowance');
    }
    this.requiresShelter.setValue(identifyNeeds.needs.includes(IdentifiedNeed.ShelterReferral) || identifyNeeds.needs.includes(IdentifiedNeed.ShelterAllowance));
    this.requiresNothing.valueChanges.subscribe((checked) => {
      if (checked) {
        this.disableNeeds();
      } else {
        this.enableNeeds();
      }
    });
    this.requiresShelter.valueChanges.subscribe((checked) => {
      if (!checked) {
        this.requiresShelterType.reset();
      }
    });
  }

  private disableNeeds() {
    this.disableFormControl(this.requiresIncidentals);
    this.disableFormControl(this.requiresClothing);
    this.disableFormControl(this.requiresFood);
    this.disableFormControl(this.requiresShelter);
    this.disableFormControl(this.requiresShelterType);
  }

  private enableNeeds() {
    this.enableFormControl(this.requiresIncidentals);
    this.enableFormControl(this.requiresClothing);
    this.enableFormControl(this.requiresFood);
    this.enableFormControl(this.requiresShelter);
    this.enableFormControl(this.requiresShelterType);
  }

  private disableFormControl(formControl: UntypedFormControl) {
    formControl.disable();
    formControl.reset();
  }

  private enableFormControl(formControl: UntypedFormControl) {
    formControl.enable();
    formControl.reset();
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
    this.secretPhrase.setValidators([Validators.required, Validators.minLength(6)]);
  }
}
