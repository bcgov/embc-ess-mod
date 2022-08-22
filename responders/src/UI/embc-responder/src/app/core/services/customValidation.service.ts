import {
  AbstractControl,
  UntypedFormGroup,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import * as globalConst from './global-constants';

@Injectable({ providedIn: 'root' })
export class CustomValidationService {
  whitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value !== undefined) {
        if ((control.value || '').trim().length === 0) {
          return { whitespaceError: true };
        }
      }
    };
  }

  userNameExistsValidator(existsIndicator: boolean): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (
        existsIndicator &&
        control.value !== null &&
        control.value !== undefined &&
        control.value !== ''
      ) {
        return { userNameExists: true };
      }
    };
  }

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
   *
   * @param predicate : condition to check
   * @param validator : validator to test again
   * @param errorName : custom error name
   */
  conditionalValidation(
    predicate: () => boolean,
    validator: ValidatorFn,
    errorName?: string
  ): ValidatorFn {
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
   * Checks the postal address pattern for Canada and USA
   */
  postalValidation(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.parent) {
        if (
          control.parent.get('country').value !== undefined &&
          control.parent.get('country').value !== null
        ) {
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
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      return Validators.pattern(globalConst.petsQuantityPattern)(control);
    };
  }

  /**
   * Checks an array of controls by name, to see if they all have different values (unless empty)
   *
   * @param controlNames : Array of Control names in FormGroup that cannot contain duplicate values
   */
  uniqueValueValidator(controlNames: string[]): ValidatorFn {
    return (formGroup: UntypedFormGroup): null => {
      const values = [];

      // Fill array of values
      for (const controlName of controlNames) {
        values.push(formGroup.get(controlName).value?.trim() ?? '');
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

      // For each duplicate, set notUnique error
      for (const dupeIndex of dupeIndexes) {
        const control = formGroup.get(controlNames[dupeIndex]);
        control.setErrors({ notUnique: true });
      }

      return null;
    };
  }

  /**
   * Group required validation for custom gst field
   *
   * @returns validation errors
   */
  groupRequiredValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value !== undefined) {
        const value1 = control.get('part1').value;
        const value2 = control.get('part2').value;
        if (
          (value1 || '').trim().length === 0 ||
          (value2 || '').trim().length === 0
        ) {
          return { groupRequiredError: true };
        }
      }
    };
  }

  /**
   * Checks if the notification email and confirm email fields match
   */
  confirmNotificationEmailValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control) {
        const email = control.get('notificationEmail').value;
        const confirmEmail = control.get('notificationConfirmEmail').value;

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
    };
  }

  confirmNotificationMobileValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control) {
        const mobile = control.get('notificationMobile').value;
        const confirmMobile = control.get('notificationConfirmMobile').value;

        if (
          mobile !== undefined &&
          confirmMobile !== undefined &&
          mobile !== null &&
          confirmMobile !== null &&
          mobile !== '' &&
          confirmMobile !== ''
        ) {
          if (mobile.toLowerCase() !== confirmMobile.toLowerCase()) {
            return { mobileMatch: true };
          }
        }
      }
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
    };
  }

  /**
   * If email has value, checks if the email and confirm email fields match
   */
  confirmEmailIsOptionalValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control) {
        const email = control.get('email').value;
        const confirmEmail = control.get('confirmEmail').value;
        if (email !== undefined && email !== null && email !== '') {
          if (
            confirmEmail === undefined ||
            confirmEmail === null ||
            confirmEmail === ''
          ) {
            return { emailMatch: true };
          }
          if (email.toLowerCase() !== confirmEmail.toLowerCase()) {
            return { emailMatch: true };
          }
        }
      }
    };
  }

  /**
   * Group minimum length validation for custom gst field
   *
   * @returns validation errors
   */
  groupMinLengthValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value !== undefined) {
        const value1 = control.get('part1').value;
        const value2 = control.get('part2').value;
        if (value1 !== '' && value2 !== '') {
          if (
            (value1 || '').trim().length < 9 ||
            (value2 || '').trim().length < 4
          ) {
            return { groupMinLengthError: true };
          }
        }
      }
    };
  }

  /**
   * Validates date picker date
   *
   * @returns validation error
   */
  validDateValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value === null) {
        return { invalidDate: true };
      }
      return null;
    };
  }

  /**
   * Checks if form array is empty
   *
   * @returns validation error
   */
  memberCheckboxValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value !== null) {
        if (control.value.length === 0) {
          return { noSelection: true };
        }
      }
      return null;
    };
  }

  /**
   * Checks if at least one field has a value
   *
   * @returns validation error
   */
  atLeastOneValidator(): ValidatorFn {
    return (control: UntypedFormGroup): { [key: string]: boolean } | null => {
      const controls = control.controls;
      if (controls) {
        const theOne = Object.keys(controls).findIndex(
          (key) => controls[key].value
        );
        if (theOne === -1) {
          return {
            atLeastOneRequired: true
          };
        }
      }
    };
  }

  /**
   * Checks if the total of meals is > 0
   */
  totalMealsValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value !== undefined) {
        const breakfastNbr = +control.get('noOfBreakfast').value;
        const lunchNbr = +control.get('noOfLunches').value;
        const dinnerNbr = +control.get('noOfDinners').value;
        if (breakfastNbr + lunchNbr + dinnerNbr === 0) {
          return { totalMealsError: true };
        }
      }
    };
  }

  /**
   * Checks if the total amount is > 0
   */
  totalZeroValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control || control.value !== '') {
        const totalAmount = +control.value;
        if (totalAmount <= 0) {
          return { totalZeroError: true };
        }
      }
    };
  }
}
