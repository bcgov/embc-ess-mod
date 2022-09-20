import { Component, Inject, NgModule, OnInit } from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  ReactiveFormsModule
} from '@angular/forms';

import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormCreationService } from 'src/app/core/services/formCreation.service';
import { MatSelectModule } from '@angular/material/select';
import { SecurityQuestionsService } from '../../../../core/services/security-questions.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-security-questions',
  templateUrl: './security-questions.component.html',
  styleUrls: ['./security-questions.component.scss']
})
export default class SecurityQuestionsComponent implements OnInit {
  formBuilder: UntypedFormBuilder;
  securityQuestionsForm$: Subscription;
  securityQuestionsForm: UntypedFormGroup;
  formCreationService: FormCreationService;
  securityQuestionOptions = [];

  constructor(
    @Inject('formBuilder') formBuilder: UntypedFormBuilder,
    @Inject('formCreationService') formCreationService: FormCreationService,
    private securityQuesService: SecurityQuestionsService
  ) {
    this.formBuilder = formBuilder;
    this.formCreationService = formCreationService;
  }

  ngOnInit(): void {
    this.createQuestionForm();
    this.securityQuestionOptions =
      this.securityQuesService.securityQuestionOptions;
  }

  /**
   * Set up main FormGroup with security Q&A inputs and validation
   */
  createQuestionForm(): void {
    this.securityQuestionsForm$ = this.formCreationService
      .getSecurityQuestionsForm()
      .subscribe((securityQuestionsForm) => {
        this.securityQuestionsForm = securityQuestionsForm;
      });
  }

  get securityQuestionsFormControl(): { [key: string]: AbstractControl } {
    return this.securityQuestionsForm.controls;
  }

  get questionsFormControl(): { [key: string]: AbstractControl } {
    return (this.securityQuestionsForm.get('questions') as UntypedFormGroup)
      .controls;
  }
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
