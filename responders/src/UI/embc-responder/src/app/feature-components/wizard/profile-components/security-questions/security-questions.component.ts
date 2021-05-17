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
import { ConfigurationService } from 'src/app/core/api/services';
import { Subscription } from 'rxjs';
import { SecurityQuestion } from 'src/app/core/api/models';
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

  bypassCheckboxChanged(event: MatCheckboxChange) {
    this.setFormDisabled(event.checked);
  }

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

  next(): void {
    this.updateTabStatus();

    if (this.stepCreateProfileService.checkTabsStatus()) {
      this.stepCreateProfileService.openModal(globalConst.wizardProfileMessage);
    } else {
      this.router.navigate(['/ess-wizard/create-evacuee-profile/review']);
    }
  }

  back(): void {
    this.router.navigate(['/ess-wizard/create-evacuee-profile/contact']);
  }

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

  ngOnDestroy(): void {
    this.updateTabStatus();

    this.questionListSubscription.unsubscribe();
  }
}
