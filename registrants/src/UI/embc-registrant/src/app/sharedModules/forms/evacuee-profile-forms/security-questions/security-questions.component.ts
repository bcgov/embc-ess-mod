import { Component, Inject, NgModule, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { CustomValidationService } from 'src/app/core/services/customValidation.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormCreationService } from 'src/app/core/services/formCreation.service';
import { MatSelectModule } from '@angular/material/select';
import { SecurityQuestionsService } from './security-questions.service';
import { AlertService } from 'src/app/core/services/alert.service';
import * as globalConst from '../../../../core/services/globalConstants';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-security-questions',
  templateUrl: './security-questions.component.html',
  styleUrls: ['./security-questions.component.scss']
})
export default class SecurityQuestionsComponent implements OnInit {
  formBuilder: FormBuilder;
  securityQuestionsForm$: Subscription;
  securityQuestionsForm: FormGroup;
  formCreationService: FormCreationService;
  securityQuestionOptions = [];

  constructor(
    @Inject('formBuilder') formBuilder: FormBuilder,
    @Inject('formCreationService') formCreationService: FormCreationService,
    private customValidationService: CustomValidationService,
    private securityQuesService: SecurityQuestionsService,
    private alertService: AlertService
  ) {
    this.formBuilder = formBuilder;
    this.formCreationService = formCreationService;
  }

  ngOnInit(): void {
    this.createQuestionForm();
    this.securityQuesService.getSecurityQuestionList().subscribe(
      (list) => {
        this.securityQuestionOptions = list;
      },
      (error) => {
        this.alertService.setAlert('danger', globalConst.securityQuesError);
      }
    );
  }

  /**
   * Set up main FormGroup with security Q&A inputs and validation
   */
  createQuestionForm(): void {
    //this.setQuestionArray(false);

    this.securityQuestionsForm$ = this.formCreationService
      .getSecurityQuestionsForm()
      .subscribe((securityQuestionsForm) => {
        console.log(securityQuestionsForm);
        this.securityQuestionsForm = securityQuestionsForm;
      });

    // this.questionForm = this.formBuilder.group(
    //   {
    //     question1: ['', [Validators.required]],
    //     answer1: [
    //       '',
    //       [
    //         Validators.minLength(3),
    //         Validators.maxLength(50),
    //         this.customValidationService.whitespaceValidator()
    //       ]
    //     ],
    //     question2: ['', [Validators.required]],
    //     answer2: [
    //       '',
    //       [
    //         Validators.minLength(3),
    //         Validators.maxLength(50),
    //         this.customValidationService.whitespaceValidator()
    //       ]
    //     ],
    //     question3: ['', [Validators.required]],
    //     answer3: [
    //       '',
    //       [
    //         Validators.minLength(3),
    //         Validators.maxLength(50),
    //         this.customValidationService.whitespaceValidator()
    //       ]
    //     ]
    //   }
    // {
    //   validators: [
    //     this.customValidationService.uniqueValueValidator([
    //       'question1',
    //       'question2',
    //       'question3'
    //     ])
    //   ]
    // }
    //);
  }

  get securityQuestionsFormControl(): { [key: string]: AbstractControl } {
    return this.securityQuestionsForm.controls;
  }

  get questionsFormControl(): { [key: string]: AbstractControl } {
    return (this.securityQuestionsForm.get('questions') as FormGroup).controls;
  }

  /**
   * Make sure that the securityQuestion array is set to the correct length
   *
   * @param clear If true, reset securityQuestions to empty/default values
   */
  // setQuestionArray(clear) {
  //   if (!this.stepEvacueeProfileService.securityQuestions || clear)
  //     this.stepEvacueeProfileService.securityQuestions = [];

  //   // Set up 3 blank security question values if not already there
  //   while (this.stepEvacueeProfileService.securityQuestions.length < 3) {
  //     this.stepEvacueeProfileService.securityQuestions.push({
  //       id: this.stepEvacueeProfileService.securityQuestions.length + 1,
  //       question: '',
  //       answer: ''
  //     });
  //   }
  // }

  // /**
  //  * Switches security question tab between readonly mode and editable mode
  //  *
  //  * @param edit True to set "Edit" mode, False to set "Readonly" mode and clear form
  //  */
  // toggleEditQuestions(edit) {
  //   this.stepEvacueeProfileService.editQuestions = edit;

  //   if (!edit) {
  //     // Reset bypass Questions if selected
  //     this.stepEvacueeProfileService.bypassSecurityQuestions = false;
  //     this.setFormDisabled(false);

  //     // Clear now-hidden Q&A form
  //     this.setQuestionArray(true);
  //     this.questionForm.reset();
  //   }
  // }
}

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule
  ],
  declarations: [SecurityQuestionsComponent]
})
class SecurityQuestionsModule {}
