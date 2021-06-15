import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  }

  sendAnswer($event): void {
    const securityAQuestion: SecurityQuestion = {
      question: this.question.question,
      answer: $event.target.value,
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
