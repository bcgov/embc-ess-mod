import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
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
        const year = dateOfBirth.substring(6);
        if (dateOfBirth !== '') {
          if (!moment(dateOfBirth, 'MM/DD/YYYY', true).isValid()) {
            validationError = { invalidDate: true };
          } else if (moment().diff(moment(dateOfBirth, 'MM-DD-YYYY')) <= 0) {
            validationError = { futureDate: true };
          } else if (year !== '' && (year < 1800 || year > moment().year())) {
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
   *
   * @param predicate : condition to check
   * @param validator : validator to test again
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
      if (control) {
        const email = control.get('email').value;
        const confirmEmail = control.get('confirmEmail').value;
        if (
          email !== undefined &&
          confirmEmail !== undefined &&
          email !== null &&
          confirmEmail !== null &&
          email !== '' &&
          confirmEmail !== ''
        ) {
          if (email.toLowerCase() !== confirmEmail.toLowerCase()) {
            return { emailMatch: true };
          }
        }
      }
      return null;
    };
  }

  /**
   * Checks if the email and confirm email field matches
   */
  compare({ fieldName }: { fieldName: string }): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control) {
        const value = control.parent.get(fieldName).value;
        const confirmValue = control.value;
        if (
          value !== undefined &&
          confirmValue !== undefined &&
          value !== null &&
          confirmValue !== null &&
          value !== '' &&
          confirmValue !== ''
        ) {
          if (value.toLowerCase() !== confirmValue.toLowerCase()) {
            return { compare: true };
          }
        }
      }
      return null;
    };
  }

  requiredConfirmEmailValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control) {
        const email = control.get('email').value;
        const confirmEmail = control.get('confirmEmail').value;
        const phone = control.get('phone').value;

        if (control.get('showContacts').value === true && (phone === null || phone === undefined || phone === '')) {
          if (
            (email !== undefined || email !== null || email === '') &&
            (confirmEmail === null || confirmEmail === '' || confirmEmail === undefined)
          ) {
            return { confirmEmailRequired: true };
          }
        }
        return null;
      }
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

  /**
   * Checks if the quantity inserted is between 1 and 999
   */
  quantityPetsValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null =>
      Validators.pattern(globalConst.petsQuantityPattern)(control);
  }

  whitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value !== undefined) {
        if ((control.value || '').trim().length === 0) {
          return { whitespaceError: true };
        }
      }
    };
  }

  /**
   * Checks an array of controls by name, to see if they all have different values (unless empty)
   *
   * @returns validation errors
   */
  uniqueValueValidator(controlNames: string[]): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control) {
        const values = [];

        // Fill array of values
        for (const controlName of controlNames) {
          values.push(control.get(controlName).value?.trim() ?? '');
        }

        // Get index of every repeated value in array
        const dupeIndexes = [];
        for (let i = 0; i < values.length; i++) {
          // Skip empty strings
          if (values[i].length === 0) continue;

          const iFirst = values.indexOf(values[i]);

          if (iFirst !== i) {
            dupeIndexes.push(i);
          }
        }

        //For each duplicate, set notUnique error
        for (const dupeIndex of dupeIndexes) {
          const controlVal = control.get(controlNames[dupeIndex]);
          controlVal.setErrors({ notUnique: true });
          return { notUnique: true };
        }
      }
      return null;
    };
  }

  public needsValidator(): ValidatorFn {
    return (group: FormGroup): ValidationErrors | null => {
      const anyNeedsIdentified =
        group.controls.requiresShelter.value ||
        group.controls.requiresFood.value ||
        group.controls.requiresClothing.value ||
        group.controls.requiresIncidentals.value;

      const noNeedsIdentified = group.controls.requiresNothing.value;
      if (!anyNeedsIdentified && !noNeedsIdentified) {
        return { invalid: true };
      }
      return null;
    };
  }
}
