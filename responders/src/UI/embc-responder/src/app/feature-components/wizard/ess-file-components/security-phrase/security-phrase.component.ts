import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';
import { StepCreateEssFileService } from '../../step-create-ess-file/step-create-ess-file.service';

import * as globalConst from '../../../../core/services/global-constants';
import { MatCheckboxChange } from '@angular/material/checkbox';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-security-phrase',
  templateUrl: './security-phrase.component.html',
  styleUrls: ['./security-phrase.component.scss']
})
export class SecurityPhraseComponent implements OnInit, OnDestroy {
  securityForm: FormGroup = null;
  tabUpdateSubscription: Subscription;

  constructor(
    private stepCreateEssFileService: StepCreateEssFileService,
    private customValidationService: CustomValidationService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Set up form validation for verification check
    this.securityForm = this.formBuilder.group({
      securityPhrase: [
        this.stepCreateEssFileService.securityPhrase,
        [
          Validators.minLength(6),
          Validators.maxLength(50),
          Validators.pattern(globalConst.securityPhrasePattern),
          this.customValidationService.whitespaceValidator()
        ]
      ],
      bypassPhrase: this.stepCreateEssFileService.bypassPhrase
    });

    this.setFormDisabled(this.stepCreateEssFileService.bypassPhrase);

    // Set "update tab status" method, called for any tab navigation
    this.tabUpdateSubscription = this.stepCreateEssFileService.nextTabUpdate.subscribe(
      () => {
        this.updateTabStatus();
      }
    );
  }

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
    this.stepCreateEssFileService.bypassPhrase = checked;

    if (this.stepCreateEssFileService.bypassPhrase) {
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
    this.stepCreateEssFileService.nextTabUpdate.next();

    if (this.stepCreateEssFileService.checkTabsStatus()) {
      this.stepCreateEssFileService.openModal(globalConst.wizardESSFileMessage);
    } else {
      this.router.navigate(['/ess-wizard/create-ess-file/review']);
    }
  }

  /**
   * Go back to the Needs tab
   */
  back(): void {
    this.router.navigate(['/ess-wizard/create-ess-file/needs']);
  }

  /**
   * Set Security Phrase values in global var, update tab's status indicator
   */
  updateTabStatus() {
    this.securityForm.updateValueAndValidity();

    const curVal = this.securityFormControl.securityPhrase.value?.trim() || '';
    const anyValueSet = curVal.length > 0;

    this.stepCreateEssFileService.securityPhrase = curVal;

    if (this.securityForm.valid) {
      this.stepCreateEssFileService.setTabStatus('security-phrase', 'complete');
    } else if (anyValueSet) {
      this.stepCreateEssFileService.setTabStatus(
        'security-phrase',
        'incomplete'
      );
    } else {
      this.stepCreateEssFileService.setTabStatus(
        'security-phrase',
        'not-started'
      );
    }
  }

  /**
   * When navigating away from tab, update variable value and status indicator
   */
  ngOnDestroy(): void {
    this.stepCreateEssFileService.nextTabUpdate.next();
    this.tabUpdateSubscription.unsubscribe();
  }
}
