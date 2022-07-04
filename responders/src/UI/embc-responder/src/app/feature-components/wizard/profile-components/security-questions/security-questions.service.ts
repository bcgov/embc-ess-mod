import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';
import { StepEvacueeProfileService } from '../../step-evacuee-profile/step-evacuee-profile.service';
import * as globalConst from '../../../../core/services/global-constants';
import { Subscription } from 'rxjs';
import { WizardService } from '../../wizard.service';

@Injectable({ providedIn: 'root' })
export class SecurityQuestionsService {
  constructor(
    private formBuilder: FormBuilder,
    private customValidationService: CustomValidationService,
    public stepEvacueeProfileService: StepEvacueeProfileService,
    private wizardService: WizardService
  ) {}

  /**
   * Set up main FormGroup with security Q&A inputs and validation
   */
  public createForm(): FormGroup {
    this.setQuestionArray(false);

    return this.formBuilder.group(
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
  }

  createParentForm(questionForm: FormGroup): FormGroup {
    return this.formBuilder.group({
      questionForm,
      bypassQuestions: this.stepEvacueeProfileService.bypassSecurityQuestions
    });
  }

  public updateTabStatus(
    parentForm: FormGroup,
    questionForm: FormGroup
  ): Subscription {
    return this.stepEvacueeProfileService.nextTabUpdate.subscribe(() => {
      parentForm.updateValueAndValidity();

      let anyValueSet = false;

      // Reset Security Questions before writing to shared object
      this.stepEvacueeProfileService.securityQuestions = [];

      // Create SecurityQuestion objects and save to array, and check if any value set
      for (let i = 1; i <= 3; i++) {
        const question = questionForm.get(`question${i}`).value?.trim() ?? '';

        const answer = questionForm.get(`answer${i}`).value?.trim() ?? '';

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
        parentForm.valid ||
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
    });
  }

  /**
   * Disables or enables the Q&A inputs on the Security Questions form
   *
   * @param checked True = Disable the form, False = Enable the form
   */
  setFormDisabled(checked, form: FormGroup) {
    this.stepEvacueeProfileService.bypassSecurityQuestions = checked;

    if (this.stepEvacueeProfileService.bypassSecurityQuestions) {
      // Reset dropdowns/inputs
      form.disable();
      form.reset();
    } else {
      form.enable();
    }
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
   * Switches security question tab between readonly mode and editable mode
   *
   * @param edit True to set "Edit" mode, False to set "Readonly" mode and clear form
   */
  toggleEditQuestions(edit, questionForm: FormGroup) {
    this.stepEvacueeProfileService.editQuestions = edit;

    if (!edit) {
      // Reset bypass Questions if selected
      this.stepEvacueeProfileService.bypassSecurityQuestions = false;
      this.setFormDisabled(false, questionForm);

      // Clear now-hidden Q&A form
      this.setQuestionArray(true);
      questionForm.reset();
    }
  }

  cleanup(questionForm: FormGroup) {
    if (this.stepEvacueeProfileService.checkForEdit() && questionForm.dirty) {
      const isFormUpdated = this.wizardService.hasChanged(
        questionForm.controls,
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
  }
}
