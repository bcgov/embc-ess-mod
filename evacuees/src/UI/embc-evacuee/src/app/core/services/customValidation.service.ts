import { AbstractControl, ValidatorFn } from '@angular/forms';
import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({ providedIn: 'root' })
export class CustomValidationService {

    /**
     * Date of Birth validation
     */
    dateOfBirthValidator(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: boolean } | null => {
            if (control.value !== null && control.value !== undefined) {
                let validationError = null;
                const dateOfBirth = control.value;
                const day = dateOfBirth.substring(0, 2);
                const month = dateOfBirth.substring(3, 5);
                const year = dateOfBirth.substring(6);
                if (!moment(dateOfBirth, 'MM/DD/YYYY').isValid()) {
                    validationError = { invalidDate: true };
                } else if (year < 1800 || year > 2100) {
                    validationError = { invalidYear: true };
                }

                return validationError;
            }
            return null;
        };
    }

}


