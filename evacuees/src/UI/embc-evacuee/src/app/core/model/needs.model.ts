import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidationService } from '../services/customValidation.service';
import { RegAddress } from './address';
import { PersonDetails } from './profile.model';

export class Evacuated {
    evacuatedFromAddress: RegAddress;
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
    haveSpecialDietSpecifications: string;
    familyMember: Array<PersonDetails>;

    constructor() { }
}

export class FamilyMembersForm {

    haveMedication = new FormControl();
    haveSpecialDiet = new FormControl();
    haveSpecialDietSpecifications = new FormControl();
    member: FormGroup;
    familyMember = new FormControl([]);
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
            sameLastNameCheck: [''],
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

        this.haveSpecialDietSpecifications.setValidators([customValidator.conditionalValidation(
            () => this.haveSpecialDiet.value,
            Validators.required
        ).bind(customValidator)]);
    }
}

export class Pet {
    quantity: number;
    type: string;
    hasPetsFood: boolean;

    constructor() { }
}

export class PetForm {
    pets = new FormControl([]);
    pet: FormGroup;
    addPetIndicator = new FormControl(false);
    hasPetsFood = new FormControl();
    addPetFoodIndicator = new FormControl(false);

    constructor(pet: Pet, customValidator: CustomValidationService, builder: FormBuilder) {
        this.pet = builder.group({
            quantity: ['', [customValidator.conditionalValidation(
                () => this.addPetIndicator.value,
                Validators.required
            ).bind(customValidator), customValidator.quantityPetsValidator().bind(customValidator)]],
            type: ['', [customValidator.conditionalValidation(
                () => this.addPetIndicator.value,
                Validators.required
            ).bind(customValidator)]]
        });

        this.hasPetsFood.setValue(pet.hasPetsFood);
        this.hasPetsFood.setValidators([customValidator.conditionalValidation(
            () => this.addPetFoodIndicator.value,
            Validators.required
        ).bind(customValidator)]);
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
    canEvacueeProvideClothing = new FormControl();
    canEvacueeProvideFood = new FormControl();
    canEvacueeProvideIncidentals = new FormControl();
    canEvacueeProvideLodging = new FormControl();
    canEvacueeProvideTransportation = new FormControl();

    constructor(identifyNeeds: IdentifyNeeds) {
        this.canEvacueeProvideClothing.setValue(identifyNeeds.canEvacueeProvideClothing);
        this.canEvacueeProvideClothing.setValidators([Validators.required]);

        this.canEvacueeProvideFood.setValue(identifyNeeds.canEvacueeProvideFood);
        this.canEvacueeProvideFood.setValidators([Validators.required]);

        this.canEvacueeProvideIncidentals.setValue(identifyNeeds.canEvacueeProvideIncidentals);
        this.canEvacueeProvideIncidentals.setValidators([Validators.required]);

        this.canEvacueeProvideLodging.setValue(identifyNeeds.canEvacueeProvideLodging);
        this.canEvacueeProvideLodging.setValidators([Validators.required]);

        this.canEvacueeProvideTransportation.setValue(identifyNeeds.canEvacueeProvideTransportation);
        this.canEvacueeProvideTransportation.setValidators([Validators.required]);
    }
}
