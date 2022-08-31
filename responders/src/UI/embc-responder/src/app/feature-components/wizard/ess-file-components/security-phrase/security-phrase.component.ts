import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';
import { StepEssFileService } from '../../step-ess-file/step-ess-file.service';

import * as globalConst from '../../../../core/services/global-constants';
import { MatCheckboxChange } from '@angular/material/checkbox';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { WizardService } from '../../wizard.service';
import { TabModel } from 'src/app/core/models/tab.model';
import { AppBaseService } from 'src/app/core/services/helper/appBase.service';

@Component({
  selector: 'app-security-phrase',
  templateUrl: './security-phrase.component.html',
  styleUrls: ['./security-phrase.component.scss']
})
export class SecurityPhraseComponent implements OnInit, OnDestroy {
  securityForm: UntypedFormGroup = null;
  tabUpdateSubscription: Subscription;
  wizardType: string;
  essFileNumber: string;
  editedSecurityPhrase: boolean;
  tabMetaData: TabModel;

  constructor(
    public stepEssFileService: StepEssFileService,
    private customValidationService: CustomValidationService,
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private wizardService: WizardService,
    private appBaseService: AppBaseService
  ) {}

  ngOnInit(): void {
    // Set up form validation for verification check
    this.createSecurityPhraseForm();

    // Set up wizard type and ESS File number
    this.wizardType = this.appBaseService?.wizardProperties?.wizardType;
    this.essFileNumber = this.appBaseService?.appModel?.selectedEssFile?.id;

    // Setting the edit Security Flag in case the wizard type is set to edit an ESS File
    this.editedPhraseFlag();

    // Setting form validation
    this.formValidation();

    // Set "update tab status" method, called for any tab navigation
    this.tabUpdateSubscription =
      this.stepEssFileService.nextTabUpdate.subscribe({
        next: () => {
          this.updateTabStatus();
        }
      });
    this.tabMetaData = this.stepEssFileService.getNavLinks('security-phrase');
  }

  /**
   * Get form controls from the security Phrase form
   */
  get securityFormControl(): { [key: string]: AbstractControl } {
    return this.securityForm.controls;
  }

  /**
   * Handle changed state of "Bypass Security Phrase" checkbox
   *
   * @param event Mat-checkbox change event, automatically passed in when triggered by form
   */
  bypassCheckboxChanged(event: MatCheckboxChange) {
    this.setFormDisabled(event.checked);
  }

  /**
   * Disables or enables the Security Phrase input
   *
   * @param checked True = Disable, False = Enable
   */
  setFormDisabled(checked) {
    this.stepEssFileService.bypassPhrase = checked;

    if (checked) {
      // Reset input
      this.securityFormControl.securityPhrase.disable();
      this.securityFormControl.securityPhrase.reset();
    } else {
      this.securityFormControl.securityPhrase.enable();
    }
  }

  /**
   * Go to the Review tab if all tabs are complete, otherwise open modal
   */
  next(): void {
    this.stepEssFileService.nextTabUpdate.next();

    if (this.stepEssFileService.checkTabsStatus()) {
      this.stepEssFileService.openModal(globalConst.wizardESSFileMessage);
    } else {
      this.router.navigate([this.tabMetaData?.next]);
    }
  }

  /**
   * Go back to the Needs tab
   */
  back(): void {
    this.router.navigate([this.tabMetaData?.previous]);
  }

  /**
   * Activates the form to edit the security phrase
   */
  editSecurityPhrase() {
    this.editedSecurityPhrase = !this.editedSecurityPhrase;
    this.securityFormControl.securityPhrase.enable();
    this.stepEssFileService.editedSecurityPhrase = true;
  }

  /**
   * Cancels the change of security phrase and goes back to the previous view
   */
  cancel(): void {
    this.stepEssFileService.securityPhrase =
      this.stepEssFileService.originalSecurityPhrase;
    this.securityForm
      .get('securityPhrase')
      .setValue(this.stepEssFileService.securityPhrase);
    this.editedSecurityPhrase = false;
    this.stepEssFileService.editedSecurityPhrase = false;
    this.securityFormControl.securityPhrase.disable();
  }

  /**
   * Set Security Phrase values in global var, update tab's status indicator
   */
  updateTabStatus() {
    this.securityForm.updateValueAndValidity();

    const curVal = this.securityFormControl.securityPhrase.value?.trim() || '';
    const anyValueSet = curVal.length > 0;

    this.stepEssFileService.securityPhrase = curVal;
    this.stepEssFileService.editedSecurityPhrase = this.editedSecurityPhrase;

    if (this.securityForm.valid) {
      this.stepEssFileService.setTabStatus('security-phrase', 'complete');
    } else if (anyValueSet) {
      this.stepEssFileService.setTabStatus('security-phrase', 'incomplete');
    } else {
      this.stepEssFileService.setTabStatus('security-phrase', 'not-started');
    }
  }

  /**
   * When navigating away from tab, update variable value and status indicator
   */
  ngOnDestroy(): void {
    if (this.stepEssFileService.checkForEdit() && this.securityForm.dirty) {
      this.wizardService.setEditStatus({
        tabName: 'security-phrase',
        tabUpdateStatus: true
      });
      this.stepEssFileService.updateEditedFormStatus();
    } else {
      this.wizardService.setEditStatus({
        tabName: 'security-phrase',
        tabUpdateStatus: false
      });
    }
    this.stepEssFileService.nextTabUpdate.next();
    this.tabUpdateSubscription.unsubscribe();
  }

  /**
   * Creates a new security phrase form
   */
  private createSecurityPhraseForm() {
    this.securityForm = this.formBuilder.group({
      securityPhrase: [
        this.stepEssFileService.securityPhrase ?? '',
        [
          Validators.minLength(6),
          Validators.maxLength(50),
          Validators.pattern(globalConst.securityPhrasePattern),
          this.customValidationService.whitespaceValidator()
        ]
      ],
      bypassPhrase: this.stepEssFileService.bypassPhrase
    });
  }

  private formValidation() {
    if (
      this.appBaseService?.appModel?.selectedEssFile?.id !== null &&
      this.appBaseService?.appModel?.selectedEssFile?.id !== undefined
    ) {
      if (
        this.stepEssFileService.securityPhrase ===
        this.stepEssFileService.originalSecurityPhrase
      ) {
        this.securityFormControl.securityPhrase.disable();
        this.editedSecurityPhrase = false;
      } else {
        this.securityFormControl.securityPhrase.enable();
        this.editedSecurityPhrase = true;
      }
    }
  }

  private editedPhraseFlag() {
    if (
      this.wizardType === 'review-file' ||
      this.wizardType === 'complete-file'
    ) {
      // If the editedSecurityFlag is not defined, set its default as false
      if (this.stepEssFileService.editedSecurityPhrase === undefined)
        this.stepEssFileService.editedSecurityPhrase = false;

      // Set up editedSecurityPhrase
      this.editedSecurityPhrase = this.stepEssFileService.editedSecurityPhrase;
    }
  }
}
