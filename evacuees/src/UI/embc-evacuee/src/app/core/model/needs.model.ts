import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidationService } from '../services/customValidation.service';
import { Address } from './address';
import { PersonDetails } from './profile.model';

export class Evacuated {
    evacuatedFromAddress: Address;
    insurance: string;

    constructor() { }
}

export class EvacuatedForm {

    evacuatedFromPrimary = new FormControl();
    evacuatedFromAddress: FormGroup;
    insurance = new FormControl();

    constructor(evacuated: Evacuated, builder: FormBuilder, customValidator: CustomValidationService) {
        this.evacuatedFromAddress = builder.group({
            addressLine1: ['', [Validators.required]],
            addressLine2: [''],
            jurisdiction: ['', [Validators.required]],
            stateProvince: ['', [Validators.required]],
            country: ['', [Validators.required]],
            postalCode: ['', [Validators.required, customValidator.postalValidation().bind(customValidator)]]
        });

        this.insurance.setValue(evacuated.insurance);
        this.insurance.setValidators([Validators.required]);
    }
}

export class FamilyMembers {
    haveMedication: boolean;
    haveSpecialDiet: boolean;
    familyMember: Array<PersonDetails>;

    constructor() { }
}

export class FamilyMembersForm {

    haveMedication = new FormControl();
    haveSpecialDiet = new FormControl();
    member: FormGroup;
    familyMember = new FormControl();
    addFamilyMemberIndicator = new FormControl(false);

    constructor(familyMembers: FamilyMembers, customValidator: CustomValidationService, builder: FormBuilder) {
        this.member = builder.group({
            firstName: ['', [customValidator.conditionalValidation(
                () => this.addFamilyMemberIndicator.value,
                Validators.required
            ).bind(customValidator)]],
            lastName: ['', [customValidator.conditionalValidation(
                () => this.addFamilyMemberIndicator.value,
                Validators.required
            ).bind(customValidator)]],
            initials: [''],
            gender: ['', [customValidator.conditionalValidation(
                () => this.addFamilyMemberIndicator.value,
                Validators.required
            ).bind(customValidator)]],
            dateOfBirth: ['', [customValidator.conditionalValidation(
                () => this.addFamilyMemberIndicator.value,
                Validators.required
            ).bind(customValidator),
            customValidator.conditionalValidation(
                () => this.addFamilyMemberIndicator.value,
                customValidator.dateOfBirthValidator().bind(customValidator)
            ).bind(customValidator)]]
        });
    }
}

export class Pet {
    quantity: string;
    type: string;
    hasPetsFood: boolean;

    constructor() { }
}

export class PetForm {
    pets = new FormControl();
    pet: FormGroup;
    addPetIndicator = new FormControl(false);
    hasPetsFood = new FormControl();

    constructor(pet: Pet, customValidator: CustomValidationService, builder: FormBuilder) {
        this.pet = builder.group({
            quantity: ['', [customValidator.conditionalValidation(
                () => this.addPetIndicator.value,
                Validators.required
            ).bind(customValidator)]],
            type: ['', [customValidator.conditionalValidation(
                () => this.addPetIndicator.value,
                Validators.required
            ).bind(customValidator)]]
        });

        this.hasPetsFood.setValue(pet.hasPetsFood);
        this.hasPetsFood.setValidators([customValidator.conditionalValidation(
            () => this.addPetIndicator.value,
            Validators.required
        ).bind(customValidator)]);
    }
}

export class IdentifyNeeds {
    requiresClothing: boolean;
    requiresFood: boolean;
    requiresIncidentals: boolean;
    requiresLodging: boolean;
    requiresTransportation: boolean;
}

export class IdentifyNeedsForm {
    requiresClothing = new FormControl();
    requiresFood = new FormControl();
    requiresIncidentals = new FormControl();
    requiresLodging = new FormControl();
    requiresTransportation = new FormControl();

    constructor(identifyNeeds: IdentifyNeeds) {
        this.requiresClothing.setValue(identifyNeeds.requiresClothing);
        this.requiresClothing.setValidators([Validators.required]);

        this.requiresFood.setValue(identifyNeeds.requiresFood);
        this.requiresFood.setValidators([Validators.required]);

        this.requiresIncidentals.setValue(identifyNeeds.requiresIncidentals);
        this.requiresIncidentals.setValidators([Validators.required]);

        this.requiresLodging.setValue(identifyNeeds.requiresLodging);
        this.requiresLodging.setValidators([Validators.required]);

        this.requiresTransportation.setValue(identifyNeeds.requiresTransportation);
        this.requiresTransportation.setValidators([Validators.required]);
    }
}
