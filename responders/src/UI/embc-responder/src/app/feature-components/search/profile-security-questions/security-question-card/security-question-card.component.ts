import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormGroup } from '@angular/forms';
import { SecurityQuestion } from 'src/app/core/api/models';

@Component({
  selector: 'app-security-question-card',
  templateUrl: './security-question-card.component.html',
  styleUrls: ['./security-question-card.component.scss']
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
