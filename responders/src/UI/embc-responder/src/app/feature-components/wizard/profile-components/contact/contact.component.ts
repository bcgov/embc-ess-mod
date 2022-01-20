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
import { Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { TabModel } from 'src/app/core/models/tab.model';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
import { StepEvacueeProfileService } from '../../step-evacuee-profile/step-evacuee-profile.service';
import { WizardService } from '../../wizard.service';
import * as globalConst from '../../../../core/services/global-constants';

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
  tabUpdateSubscription: Subscription;
  tabMetaData: TabModel;

  constructor(
    private router: Router,
    private stepEvacueeProfileService: StepEvacueeProfileService,
    private formBuilder: FormBuilder,
    private customValidation: CustomValidationService,
    private wizardService: WizardService,
    private evacueeSessionService: EvacueeSessionService
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

    // Set "update tab status" method, called for any tab navigation
    this.tabUpdateSubscription =
      this.stepEvacueeProfileService.nextTabUpdate.subscribe(() => {
        this.updateTabStatus();
      });
    this.tabMetaData = this.stepEvacueeProfileService.getNavLinks('contact');
  }

  createContactForm(): void {
    this.contactInfoForm = this.formBuilder.group(
      {
        email: [
          this.stepEvacueeProfileService?.contactDetails?.email !== undefined
            ? this.stepEvacueeProfileService?.contactDetails?.email
            : '',
          [
            Validators.email,
            this.customValidation.conditionalValidation(
              () =>
                (this.contactInfoForm.get('phone').value === '' ||
                  this.contactInfoForm.get('phone').value === undefined ||
                  this.contactInfoForm.get('phone').value === null) &&
                this.contactInfoForm.get('showContacts').value === true,
              this.customValidation.whitespaceValidator()
            )
          ]
        ],
        phone: [
          this.stepEvacueeProfileService?.contactDetails?.phone !== undefined
            ? this.stepEvacueeProfileService?.contactDetails?.phone
            : '',
          [
            this.customValidation
              .maskedNumberLengthValidator()
              .bind(this.customValidation),
            this.customValidation.conditionalValidation(
              () =>
                (this.contactInfoForm.get('email').value === '' ||
                  this.contactInfoForm.get('email').value === undefined ||
                  this.contactInfoForm.get('email').value === null) &&
                this.contactInfoForm.get('showContacts').value === true,
              this.customValidation.whitespaceValidator()
            )
          ]
        ],
        confirmEmail: [
          this.stepEvacueeProfileService?.confirmEmail !== undefined
            ? this.stepEvacueeProfileService?.confirmEmail
            : '',
          [
            Validators.email,
            this.customValidation.conditionalValidation(
              () =>
                this.contactInfoForm.get('email').value !== '' &&
                this.contactInfoForm.get('email').value !== undefined &&
                this.contactInfoForm.get('email').value !== null &&
                this.contactInfoForm.get('showContacts').value === true,
              this.customValidation.whitespaceValidator()
            )
          ]
        ],
        showContacts: [
          this.stepEvacueeProfileService?.showContact !== undefined
            ? this.stepEvacueeProfileService?.showContact
            : '',
          [Validators.required]
        ]
      },
      { validators: [this.customValidation.confirmEmailValidator()] }
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
    if (this.evacueeSessionService.paperBased) {
      if (this.stepEvacueeProfileService.checkTabsStatus()) {
        this.stepEvacueeProfileService.openModal(
          globalConst.wizardProfileMessage
        );
      } else {
        this.router.navigate([this.tabMetaData?.next]);
      }
    } else {
      this.router.navigate([this.tabMetaData?.next]);
    }
  }

  /**
   * Navigates to previous tab
   */
  back(): void {
    this.router.navigate([this.tabMetaData?.previous]);
  }

  /**
   * When navigating away from tab, update variable value and status indicator
   */
  ngOnDestroy(): void {
    if (this.stepEvacueeProfileService.checkForEdit()) {
      const isFormUpdated = this.wizardService.hasChanged(
        this.contactInfoForm.controls,
        'contactDetails'
      );

      this.wizardService.setEditStatus({
        tabName: 'contact',
        tabUpdateStatus: isFormUpdated
      });
      this.stepEvacueeProfileService.updateEditedFormStatus();
    }
    this.stepEvacueeProfileService.nextTabUpdate.next();
    this.tabUpdateSubscription.unsubscribe();
  }

  /**
   * Checks the form validity and updates the tab status
   */
  private updateTabStatus() {
    if (this.contactInfoForm.valid) {
      this.stepEvacueeProfileService.setTabStatus('contact', 'complete');
    } else if (
      this.stepEvacueeProfileService.checkForPartialUpdates(
        this.contactInfoForm
      )
    ) {
      this.stepEvacueeProfileService.setTabStatus('contact', 'incomplete');
    } else {
      this.stepEvacueeProfileService.setTabStatus('contact', 'not-started');
    }
    this.saveFormUpdates();
  }

  /**
   * Persists the form values to the service
   */
  private saveFormUpdates(): void {
    this.stepEvacueeProfileService.contactDetails = this.contactInfoForm.value;
    this.stepEvacueeProfileService.showContact =
      this.contactInfoForm.get('showContacts').value;
    this.stepEvacueeProfileService.confirmEmail =
      this.contactInfoForm.get('confirmEmail').value;
  }
}
