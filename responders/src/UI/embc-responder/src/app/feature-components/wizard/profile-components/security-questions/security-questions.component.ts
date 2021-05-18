import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';

import { StepCreateProfileService } from '../../step-create-profile/step-create-profile.service';
import * as globalConst from '../../../../core/services/global-constants';
import { MatCheckboxChange } from '@angular/material/checkbox';

import { CustomValidationService } from 'src/app/core/services/customValidation.service';
import { Subscription } from 'rxjs';
import { SecurityQuestionsService } from './security-questions.service';

@Component({
  selector: 'app-security-questions',
  templateUrl: './security-questions.component.html',
  styleUrls: ['./security-questions.component.scss']
})
export class SecurityQuestionsComponent implements OnInit, OnDestroy {
  questionListSubscription: Subscription;
  secQuestions: string[];

  questionForm: FormGroup = null;
  bypassQuestions: FormControl = null;

  constructor(
    private router: Router,
    private stepCreateProfileService: StepCreateProfileService,
    private formBuilder: FormBuilder,
    private customValidationService: CustomValidationService,
    private securityQuestionsService: SecurityQuestionsService
  ) {}

  ngOnInit(): void {
    // Set security question values from API
    this.questionListSubscription = this.securityQuestionsService
      .getSecurityQuestionList()
      .subscribe((questions) => {
        this.secQuestions = questions;
      });

    this.createQuestionForm();

    // Set "Bypass Questions" button and disable inputs if necessary
    this.bypassQuestions = new FormControl(
      this.stepCreateProfileService.bypassSecurityQuestions
    );

    this.setFormDisabled(this.stepCreateProfileService.bypassSecurityQuestions);
  }

  /**
   * Set up main FormGroup with security Q&A inputs and validation
   */
  createQuestionForm(): void {
    if (!this.stepCreateProfileService.securityQuestions)
      this.stepCreateProfileService.securityQuestions = [];

    // Set up 3 blank security question values if not already there
    while (this.stepCreateProfileService.securityQuestions.length < 3) {
      this.stepCreateProfileService.securityQuestions.push({
        id: this.stepCreateProfileService.securityQuestions.length + 1,
        question: '',
        answer: ''
      });
    }

    this.questionForm = this.formBuilder.group(
      {
        question1: [
          this.stepCreateProfileService.securityQuestions[0].question ?? '',
          [Validators.required]
        ],
        answer1: [
          this.stepCreateProfileService.securityQuestions[0].answer ?? '',
          [
            Validators.minLength(3),
            Validators.maxLength(50),
            Validators.pattern(/^[a-zA-Z0-9 ]+$/),
            this.customValidationService.whitespaceValidator()
          ]
        ],
        question2: [
          this.stepCreateProfileService.securityQuestions[1].question ?? '',
          [Validators.required]
        ],
        answer2: [
          this.stepCreateProfileService.securityQuestions[1].answer ?? '',
          [
            Validators.minLength(3),
            Validators.maxLength(50),
            Validators.pattern(/^[a-zA-Z0-9 ]+$/),
            this.customValidationService.whitespaceValidator()
          ]
        ],
        question3: [
          this.stepCreateProfileService.securityQuestions[2].question ?? '',
          [Validators.required]
        ],
        answer3: [
          this.stepCreateProfileService.securityQuestions[2].answer ?? '',
          [
            Validators.minLength(3),
            Validators.maxLength(50),
            Validators.pattern(/^[a-zA-Z0-9 ]+$/),
            this.customValidationService.whitespaceValidator()
          ]
        ]
      },
      {
        validators: [
          this.customValidationService.uniqueValueValidator([
            'question1',
            'question2',
            'question3'
          ])
        ]
      }
    );
  }

  get questionFormControl(): { [key: string]: AbstractControl } {
    return this.questionForm.controls;
  }

  /**
   * Handle changed state of "Bypass Security Questions" checkbox
   *
   * @param event Mat-checkbox change event, automatically passed in when triggered by form
   */
  bypassCheckboxChanged(event: MatCheckboxChange) {
    this.setFormDisabled(event.checked);
  }

  /**
   * Disables or enables the Q&A inputs on the Security Questions form
   *
   * @param checked True = Disable the form, False = Enable the form
   */
  setFormDisabled(checked) {
    this.stepCreateProfileService.bypassSecurityQuestions = checked;

    if (this.stepCreateProfileService.bypassSecurityQuestions) {
      // Reset dropdowns/inputs
      this.questionForm.disable();
      this.questionForm.reset();
    } else {
      this.questionForm.enable();
    }
  }

  /**
   * Go to the Review tab if all tabs are complete, otherwise open modal
   */
  next(): void {
    this.updateTabStatus();

    if (this.stepCreateProfileService.checkTabsStatus()) {
      this.stepCreateProfileService.openModal(globalConst.wizardProfileMessage);
    } else {
      this.router.navigate(['/ess-wizard/create-evacuee-profile/review']);
    }
  }

  /**
   * Go back to the Contact tab
   */
  back(): void {
    this.router.navigate(['/ess-wizard/create-evacuee-profile/contact']);
  }

  /**
   * Set Security Question values in global var, update tab's status indicator
   */
  updateTabStatus() {
    this.questionForm.updateValueAndValidity();

    let anyValueSet = false;

    // Reset Security Questions before writing to shared object
    this.stepCreateProfileService.securityQuestions = [];

    // Create SecurityQuestion objects and save to array, and check if any value set
    for (let i = 1; i <= 3; i++) {
      const question =
        this.questionForm.get(`question${i}`).value?.trim() ?? '';

      const answer = this.questionForm.get(`answer${i}`).value?.trim() ?? '';

      if (question.length > 0 || answer.length > 0) {
        anyValueSet = true;
      }

      this.stepCreateProfileService.securityQuestions.push({
        id: i,
        question,
        answer
      });
    }

    // Based on state of form, set tab status
    if (
      this.questionForm.valid ||
      this.stepCreateProfileService.bypassSecurityQuestions
    ) {
      this.stepCreateProfileService.setTabStatus(
        'security-questions',
        'complete'
      );
    } else if (anyValueSet) {
      this.stepCreateProfileService.setTabStatus(
        'security-questions',
        'incomplete'
      );
    } else {
      this.stepCreateProfileService.setTabStatus(
        'security-questions',
        'not-started'
      );
    }
  }

  /**
   * When navigating away from tab, update Security Question variable and status indicator
   */
  ngOnDestroy(): void {
    this.updateTabStatus();

    this.questionListSubscription.unsubscribe();
  }
}
