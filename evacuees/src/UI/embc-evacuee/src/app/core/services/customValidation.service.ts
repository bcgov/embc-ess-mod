import { AbstractControl, ValidatorFn, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import * as globalConst from '../services/globalConstants';

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
                if (dateOfBirth !== '') {
                    if (!moment(dateOfBirth, 'MM/DD/YYYY', true).isValid()) {
                        validationError = { invalidDate: true };
                    } else if (moment().diff(moment(dateOfBirth, 'MM-DD-YYYY')) <= 0) {
                        validationError = { futureDate: true };
                    } else if (year !== '' && (year < 1800 || year > 2100)) {
                        validationError = { invalidYear: true };
                    }
                }
                return validationError;
            }
            return null;
        };
    }

    /**
     * Validition for the fields that are conditional
     * @param predicate : condition to check
     * @param validator : validtor to test again
     * @param errorName : custom error name
     */
    conditionalValidation(predicate: () => boolean, validator: ValidatorFn, errorName?: string): ValidatorFn {
        return (control: AbstractControl): { [key: string]: boolean } | null => {
            if (control.parent) {
                let validationError = null;
                if (predicate()) {
                    validationError = validator(control);
                }

                if (errorName && validationError) {
                    const customError = {};
                    customError[errorName] = validationError;
                    validationError = customError;
                }

                return validationError;
            }
            return null;
        };
    }

    /**
     * Checks if the email and confirm email field matches
     */
    confirmEmailValidator(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: boolean } | null => {
            if (control.value !== null && control.value !== undefined) {
                const email = control.parent.get('email').value;
                const confirmEmail = control.value;
                if (email.toLowerCase() !== confirmEmail.toLowerCase()) {
                    return { emailMatch: true };
                }
            }
            return null;
        };
    }

    /**
     * Checks the postal address pattern for Canada and USA
     */
    postalValidation(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: boolean } | null => {
            if (control.parent) {
                if (control.parent.get('country').value !== undefined && control.parent.get('country').value !== null) {
                    if (control.parent.get('country').value.code === 'CAN') {
                        return Validators.pattern(globalConst.postalPattern)(control);
                    } else if (control.parent.get('country').value.code === 'USA') {
                        return Validators.pattern(globalConst.zipCodePattern)(control);
                    }
                }
            }
            return null;
        };
    }

    /**
     * Checks length of masked fields
     */
    maskedNumberLengthValidator(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: boolean } | null => {
            if (control.value !== null && control.value !== undefined) {
                if (control.value.indexOf('_') !== -1) {
                    return { incorrectLength: true };
                }
            }
            return null;
        };
    }

}


