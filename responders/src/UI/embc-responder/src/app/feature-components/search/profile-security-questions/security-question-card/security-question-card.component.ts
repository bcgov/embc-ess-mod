import { Component, Input, OnInit } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SecurityQuestion } from 'src/app/core/api/models';

@Component({
  selector: 'app-security-question-card',
  templateUrl: './security-question-card.component.html',
  styleUrls: ['./security-question-card.component.scss']
})
export class SecurityQuestionCardComponent implements OnInit {
  @Input() question: SecurityQuestion;
  @Output() questionEvent = new EventEmitter<SecurityQuestion>();

  securityQuestionForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.createAnswerForm();
    this.securityQuestionForm.valueChanges.subscribe((value) => {
      console.log('In value changes');
      console.log(value);
    });
  }

  sendAnswer(): void {
    const securityAQuestion: SecurityQuestion = {
      question: this.question.question,
      answer: this.securityQuestionForm.get('answer').value,
      answerChanged: false,
      id: this.question.id
    };
    this.questionEvent.emit(securityAQuestion);
  }

  private createAnswerForm(): void {
    this.securityQuestionForm = this.formBuilder.group({
      answer: ['']
    });
  }
}
