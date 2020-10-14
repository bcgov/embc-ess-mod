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
    // familyMember: FormArray;

    constructor(familyMembers: FamilyMembers, customValidator: CustomValidationService, builder: FormBuilder, ) {
        this.member = builder.group({
            firstName: ['', [Validators.required]],
            lastName: ['', [Validators.required]],
            initials: [''],
            gender: ['', [Validators.required]],
            dateOfBirth: ['', [Validators.required, customValidator.dateOfBirthValidator().bind(customValidator)]]
        });
        // this.familyMember = builder.array([
        //     builder.group({
        //         firstName: ['', [Validators.required]],
        //         lastName: ['', [Validators.required]],
        //         initials: [''],
        //         gender: ['', [Validators.required]],
        //         dateOfBirth: ['', [Validators.required, customValidator.dateOfBirthValidator().bind(customValidator)]],
        //     })
        // ]);
    }


}
