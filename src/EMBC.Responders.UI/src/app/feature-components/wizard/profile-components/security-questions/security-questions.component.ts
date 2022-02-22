import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';

import { StepEvacueeProfileService } from '../../step-evacuee-profile/step-evacuee-profile.service';
import * as globalConst from '../../../../core/services/global-constants';
import { MatCheckboxChange } from '@angular/material/checkbox';

import { CustomValidationService } from 'src/app/core/services/customValidation.service';
import { Subscription } from 'rxjs';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
import { WizardService } from '../../wizard.service';
import { distinctUntilChanged } from 'rxjs/operators';
import { TabModel } from 'src/app/core/models/tab.model';

@Component({
  selector: 'app-security-questions',
  templateUrl: './security-questions.component.html',
  styleUrls: ['./security-questions.component.scss']
})
export class SecurityQuestionsComponent implements OnInit, OnDestroy {
  parentForm: FormGroup = null;
  questionForm: FormGroup = null;
  tabUpdateSubscription: Subscription;
  tabMetaData: TabModel;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private customValidationService: CustomValidationService,
    public stepEvacueeProfileService: StepEvacueeProfileService,
    public evacueeSessionService: EvacueeSessionService,
    private wizardService: WizardService
  ) {}

  ngOnInit(): void {
    this.createQuestionForm();

    this.setFormDisabled(
      this.stepEvacueeProfileService.bypassSecurityQuestions
    );

    //Update value and validity for each security question dropdown when any of the questions change
    this.questionForm
      .get('question1')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        this.questionForm.get('question2').updateValueAndValidity();
        this.questionForm.get('question3').updateValueAndValidity();
      });

    // Set "update tab status" method, called for any tab navigation
    this.tabUpdateSubscription =
      this.stepEvacueeProfileService.nextTabUpdate.subscribe(() => {
        this.updateTabStatus();
      });

    this.questionForm
      .get('question2')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        this.questionForm.get('question1').updateValueAndValidity();
        this.questionForm.get('question3').updateValueAndValidity();
      });

    this.questionForm
      .get('question3')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        this.questionForm.get('question1').updateValueAndValidity();
        this.questionForm.get('question2').updateValueAndValidity();
      });

    this.tabMetaData =
      this.stepEvacueeProfileService.getNavLinks('security-questions');
  }

  /**
   * Set up main FormGroup with security Q&A inputs and validation
   */
  createQuestionForm(): void {
    this.setQuestionArray(false);

    this.questionForm = this.formBuilder.group(
      {
        question1: [
          this.stepEvacueeProfileService.securityQuestions[0].question ?? '',
          [Validators.required]
        ],
        answer1: [
          this.stepEvacueeProfileService.securityQuestions[0].answer ?? '',
          [
            Validators.minLength(3),
            Validators.maxLength(50),
            Validators.pattern(globalConst.securityQuestionAnswerPattern),
            this.customValidationService.whitespaceValidator()
          ]
        ],
        question2: [
          this.stepEvacueeProfileService.securityQuestions[1].question ?? '',
          [Validators.required]
        ],
        answer2: [
          this.stepEvacueeProfileService.securityQuestions[1].answer ?? '',
          [
            Validators.minLength(3),
            Validators.maxLength(50),
            Validators.pattern(globalConst.securityQuestionAnswerPattern),
            this.customValidationService.whitespaceValidator()
          ]
        ],
        question3: [
          this.stepEvacueeProfileService.securityQuestions[2].question ?? '',
          [Validators.required]
        ],
        answer3: [
          this.stepEvacueeProfileService.securityQuestions[2].answer ?? '',
          [
            Validators.minLength(3),
            Validators.maxLength(50),
            Validators.pattern(globalConst.securityQuestionAnswerPattern),
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

    this.parentForm = this.formBuilder.group({
      questionForm: this.questionForm,
      bypassQuestions: this.stepEvacueeProfileService.bypassSecurityQuestions
    });

    this.questionForm = this.parentForm.get('questionForm') as FormGroup;
  }

  get parentFormControl(): { [key: string]: AbstractControl } {
    return this.parentForm.controls;
  }

  get questionFormControl(): { [key: string]: AbstractControl } {
    return this.questionForm.controls;
  }

  /**
   * Make sure that the securityQuestion array is set to the correct length
   *
   * @param clear If true, reset securityQuestions to empty/default values
   */
  setQuestionArray(clear) {
    if (!this.stepEvacueeProfileService.securityQuestions || clear)
      this.stepEvacueeProfileService.securityQuestions = [];

    // Set up 3 blank security question values if not already there
    while (this.stepEvacueeProfileService.securityQuestions.length < 3) {
      this.stepEvacueeProfileService.securityQuestions.push({
        id: this.stepEvacueeProfileService.securityQuestions.length + 1,
        question: '',
        answer: ''
      });
    }
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
    this.stepEvacueeProfileService.bypassSecurityQuestions = checked;

    if (this.stepEvacueeProfileService.bypassSecurityQuestions) {
      // Reset dropdowns/inputs
      this.questionForm.disable();
      this.questionForm.reset();
    } else {
      this.questionForm.enable();
    }
  }

  /**
   * Switches security question tab between readonly mode and editable mode
   *
   * @param edit True to set "Edit" mode, False to set "Readonly" mode and clear form
   */
  toggleEditQuestions(edit) {
    this.stepEvacueeProfileService.editQuestions = edit;

    if (!edit) {
      // Reset bypass Questions if selected
      this.stepEvacueeProfileService.bypassSecurityQuestions = false;
      this.setFormDisabled(false);

      // Clear now-hidden Q&A form
      this.setQuestionArray(true);
      this.questionForm.reset();
    }
  }

  /**
   * Go to the Review tab if all tabs are complete, otherwise open modal
   */
  next(): void {
    this.stepEvacueeProfileService.nextTabUpdate.next();

    if (this.stepEvacueeProfileService.checkTabsStatus()) {
      this.stepEvacueeProfileService.openModal(
        globalConst.wizardProfileMessage
      );
    } else {
      this.router.navigate([this.tabMetaData?.next]);
    }
  }

  /**
   * Go back to the Contact tab
   */
  back(): void {
    this.router.navigate([this.tabMetaData?.previous]);
  }

  /**
   * Set Security Question values in global var, update tab's status indicator
   */
  updateTabStatus() {
    this.parentForm.updateValueAndValidity();

    let anyValueSet = false;

    // Reset Security Questions before writing to shared object
    this.stepEvacueeProfileService.securityQuestions = [];

    // Create SecurityQuestion objects and save to array, and check if any value set
    for (let i = 1; i <= 3; i++) {
      const question =
        this.questionForm.get(`question${i}`).value?.trim() ?? '';

      const answer = this.questionForm.get(`answer${i}`).value?.trim() ?? '';

      if (question.length > 0 || answer.length > 0) {
        anyValueSet = true;
      }

      this.stepEvacueeProfileService.securityQuestions.push({
        id: i,
        answerChanged: true,
        question,
        answer
      });
    }

    // Based on state of form, set tab status
    if (
      this.parentForm.valid ||
      (!this.stepEvacueeProfileService.editQuestions &&
        this.stepEvacueeProfileService.savedQuestions?.length > 0)
    ) {
      this.stepEvacueeProfileService.setTabStatus(
        'security-questions',
        'complete'
      );
    } else if (anyValueSet) {
      this.stepEvacueeProfileService.setTabStatus(
        'security-questions',
        'incomplete'
      );
    } else {
      this.stepEvacueeProfileService.setTabStatus(
        'security-questions',
        'not-started'
      );
    }
  }

  /**
   * When navigating away from tab, update variable value and status indicator
   */
  ngOnDestroy(): void {
    if (
      this.stepEvacueeProfileService.checkForEdit() &&
      this.questionForm.dirty
    ) {
      const isFormUpdated = this.wizardService.hasChanged(
        this.questionForm.controls,
        'securityQuestions'
      );

      this.wizardService.setEditStatus({
        tabName: 'securityQuestions',
        tabUpdateStatus: isFormUpdated
      });
      this.stepEvacueeProfileService.updateEditedFormStatus();
    } else {
      this.wizardService.setEditStatus({
        tabName: 'securityQuestions',
        tabUpdateStatus: false
      });
    }
    this.stepEvacueeProfileService.nextTabUpdate.next();
    this.tabUpdateSubscription.unsubscribe();
  }
}
