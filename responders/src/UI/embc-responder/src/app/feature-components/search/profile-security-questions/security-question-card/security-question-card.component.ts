import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SecurityQuestion } from 'src/app/core/api/models';

import { MatInput } from '@angular/material/input';
import { MatFormField, MatError } from '@angular/material/form-field';
import { MatCard, MatCardContent } from '@angular/material/card';

@Component({
  selector: 'app-security-question-card',
  templateUrl: './security-question-card.component.html',
  styleUrls: ['./security-question-card.component.scss'],
  standalone: true,
  imports: [MatCard, FormsModule, ReactiveFormsModule, MatCardContent, MatFormField, MatInput, MatError]
})
export class SecurityQuestionCardComponent implements OnInit {
  @Input() question: SecurityQuestion;
  @Input() parentForm: UntypedFormGroup;
  @Input() index: number;
  controlName: string;

  constructor() {}

  ngOnInit(): void {
    this.controlName = 'answer' + this.index;
  }

  /**
   * Return form control
   */
  get securityQuestionsFormControl(): { [key: string]: AbstractControl } {
    return this.parentForm.controls;
  }
}
