import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  SecurityQuestion,
  SecurityAnswer
} from '../profile-security-questions.component';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-security-question-card',
  templateUrl: './security-question-card.component.html',
  styleUrls: ['./security-question-card.component.scss']
})
export class SecurityQuestionCardComponent implements OnInit {
  @Input() question: SecurityQuestion;
  @Output() questionEvent = new EventEmitter<SecurityAnswer>();

  constructor() {}

  ngOnInit(): void {}

  sendAnswer($event): void {
    const securityAnswer: SecurityAnswer = {
      question: this.question.question,
      answer: $event.target.value
    };

    this.questionEvent.emit(securityAnswer);
  }
}
