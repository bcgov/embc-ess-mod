import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { CustomValidationService } from "../services/customValidation.service";
import { Address } from "./address";

export class Evacuated {
    evacuatedFromAddress: Address;
    insurance: string;

    constructor() {}
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