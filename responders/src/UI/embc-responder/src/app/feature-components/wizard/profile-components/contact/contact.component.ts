import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  Validators
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatRadioChange } from '@angular/material/radio';
import { Router } from '@angular/router';
import { distinctUntilChanged } from 'rxjs/operators';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';
import { StepCreateProfileService } from '../../step-create-profile/step-create-profile.service';

export class CustomErrorMailMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return (
      !!(
        control &&
        control.invalid &&
        (control.dirty || control.touched || isSubmitted)
      ) || control.parent.hasError('emailMatch')
    );
  }
}

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit, OnDestroy {
  contactInfoForm: FormGroup;
  readonly phoneMask = [
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
    /\d/,
    /\d/
  ];
  emailMatcher = new CustomErrorMailMatcher();

  constructor(
    private router: Router,
    private stepCreateProfileService: StepCreateProfileService,
    private formBuilder: FormBuilder,
    private customValidation: CustomValidationService
  ) {}

  ngOnInit(): void {
    this.createContactForm();

    this.contactInfoForm
      .get('phone')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.contactInfoForm.get('phone').reset();
        }
        this.contactInfoForm.get('email').updateValueAndValidity();
        this.contactInfoForm.get('confirmEmail').updateValueAndValidity();
      });

    this.contactInfoForm
      .get('email')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.contactInfoForm.get('email').reset();
          this.contactInfoForm.get('confirmEmail').reset();
          this.contactInfoForm.get('confirmEmail').disable();
        } else {
          this.contactInfoForm.get('confirmEmail').enable();
        }
        this.contactInfoForm.get('phone').updateValueAndValidity();
        this.contactInfoForm.get('confirmEmail').updateValueAndValidity();
      });

    this.contactInfoForm
      .get('confirmEmail')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.contactInfoForm.get('confirmEmail').reset();
        }
        this.contactInfoForm.get('email').updateValueAndValidity();
        this.contactInfoForm.get('phone').updateValueAndValidity();
      });
  }

  createContactForm(): void {
    this.contactInfoForm = this.formBuilder.group(
      {
        email: [
          this.stepCreateProfileService?.contactDetails?.email !== undefined
            ? this.stepCreateProfileService?.contactDetails?.email
            : '',
          [
            Validators.email,
            this.customValidation
              .conditionalValidation(
                () =>
                  (this.contactInfoForm.get('phone').value === '' ||
                    this.contactInfoForm.get('phone').value === undefined ||
                    this.contactInfoForm.get('phone').value === null) &&
                  this.contactInfoForm.get('showContacts').value === true,
                this.customValidation.whitespaceValidator()
              )
              .bind(this.customValidation)
          ]
        ],
        phone: [
          this.stepCreateProfileService?.contactDetails?.phone !== undefined
            ? this.stepCreateProfileService?.contactDetails?.phone
            : '',
          [
            this.customValidation
              .maskedNumberLengthValidator()
              .bind(this.customValidation),
            this.customValidation
              .conditionalValidation(
                () =>
                  (this.contactInfoForm.get('email').value === '' ||
                    this.contactInfoForm.get('email').value === undefined ||
                    this.contactInfoForm.get('email').value === null) &&
                  this.contactInfoForm.get('showContacts').value === true,
                this.customValidation.whitespaceValidator()
              )
              .bind(this.customValidation)
          ]
        ],
        confirmEmail: [
          this.stepCreateProfileService?.confirmEmail !== undefined
            ? this.stepCreateProfileService?.confirmEmail
            : '',
          [
            Validators.email,
            this.customValidation
              .conditionalValidation(
                () =>
                  this.contactInfoForm.get('email').value !== '' &&
                  this.contactInfoForm.get('email').value !== undefined &&
                  this.contactInfoForm.get('email').value !== null &&
                  this.contactInfoForm.get('showContacts').value === true,
                this.customValidation.whitespaceValidator()
              )
              .bind(this.customValidation)
          ]
        ],
        showContacts: [
          this.stepCreateProfileService?.showContact !== undefined
            ? this.stepCreateProfileService?.showContact
            : '',
          [Validators.required]
        ]
      },
      {
        validator: this.customValidation
          .confirmEmailValidator()
          .bind(this.customValidation)
      }
    );
  }

  /**
   * Returns the control of the form
   */
  get contactFormControl(): { [key: string]: AbstractControl } {
    return this.contactInfoForm.controls;
  }

  hideContact(event: MatRadioChange): void {
    if (!event.value) {
      this.contactInfoForm.get('phone').reset();
      this.contactInfoForm.get('email').reset();
      this.contactInfoForm.get('confirmEmail').reset();
      this.updateOnVisibility();
    }
  }

  updateOnVisibility(): void {
    this.contactInfoForm.get('phone').updateValueAndValidity();
    this.contactInfoForm.get('email').updateValueAndValidity();
    this.contactInfoForm.get('confirmEmail').updateValueAndValidity();
  }

  /**
   * Navigate to next tab
   */
  next(): void {
    this.router.navigate([
      '/ess-wizard/create-evacuee-profile/security-questions'
    ]);
  }

  /**
   * Navigates to previous tab
   */
  back(): void {
    this.router.navigate(['/ess-wizard/create-evacuee-profile/address']);
  }

  /**
   * Checks the form validity and updates the tab status
   */
  private updateTabStatus() {
    if (this.contactInfoForm.valid) {
      this.stepCreateProfileService.setTabStatus('contact', 'complete');
    } else if (
      this.stepCreateProfileService.checkForPartialUpdates(this.contactInfoForm)
    ) {
      this.stepCreateProfileService.setTabStatus('contact', 'incomplete');
    } else {
      this.stepCreateProfileService.setTabStatus('contact', 'not-started');
    }
    this.saveFormUpdates();
  }

  /**
   * Persists the form values to the service
   */
  private saveFormUpdates(): void {
    this.stepCreateProfileService.contactDetails = this.contactInfoForm.value;
    this.stepCreateProfileService.showContact = this.contactInfoForm.get(
      'showContacts'
    ).value;
    this.stepCreateProfileService.confirmEmail = this.contactInfoForm.get(
      'confirmEmail'
    ).value;
  }

  ngOnDestroy(): void {
    this.updateTabStatus();
  }
}
