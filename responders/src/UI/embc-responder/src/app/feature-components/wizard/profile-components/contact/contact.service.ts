import { Injectable } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { TabModel } from 'src/app/core/models/tab.model';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';
import { StepEvacueeProfileService } from '../../step-evacuee-profile/step-evacuee-profile.service';
import { WizardService } from '../../wizard.service';

@Injectable({ providedIn: 'root' })
export class ContactService {
  contactInfoForm: UntypedFormGroup;
  tabMetaData: TabModel;

  constructor(
    private stepEvacueeProfileService: StepEvacueeProfileService,
    private formBuilder: UntypedFormBuilder,
    private customValidation: CustomValidationService,
    private wizardService: WizardService
  ) {}

  init() {
    this.tabMetaData = this.stepEvacueeProfileService.getNavLinks('contact');
  }

  public createForm(): UntypedFormGroup {
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

    return this.contactInfoForm;
  }

  public updateTabStatus(form: UntypedFormGroup): Subscription {
    return this.stepEvacueeProfileService.nextTabUpdate.subscribe(() => {
      if (form.valid) {
        this.stepEvacueeProfileService.setTabStatus('contact', 'complete');
      } else if (this.stepEvacueeProfileService.checkForPartialUpdates(form)) {
        this.stepEvacueeProfileService.setTabStatus('contact', 'incomplete');
      } else {
        this.stepEvacueeProfileService.setTabStatus('contact', 'not-started');
      }
      this.saveFormUpdates(form);
    });
  }

  public cleanup(form: UntypedFormGroup) {
    if (this.stepEvacueeProfileService.checkForEdit()) {
      const isFormUpdated = this.wizardService.hasChanged(
        form.controls,
        'contactDetails'
      );

      this.wizardService.setEditStatus({
        tabName: 'contact',
        tabUpdateStatus: isFormUpdated
      });
      this.stepEvacueeProfileService.updateEditedFormStatus();
    }
    this.stepEvacueeProfileService.nextTabUpdate.next();
  }

  updateOnVisibility(form: UntypedFormGroup): void {
    form.get('phone').updateValueAndValidity();
    form.get('email').updateValueAndValidity();
    form.get('confirmEmail').updateValueAndValidity();
  }

  /**
   * Persists the form values to the service
   */
  private saveFormUpdates(form: UntypedFormGroup): void {
    this.stepEvacueeProfileService.contactDetails = form.value;
    this.stepEvacueeProfileService.showContact = form.get('showContacts').value;
    this.stepEvacueeProfileService.confirmEmail =
      form.get('confirmEmail').value;
  }
}
