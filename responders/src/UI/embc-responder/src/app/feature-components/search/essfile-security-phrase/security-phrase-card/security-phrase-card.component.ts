import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-security-phrase-card',
  templateUrl: './security-phrase-card.component.html',
  styleUrls: ['./security-phrase-card.component.scss']
})
export class SecurityPhraseCardComponent implements OnInit {
  @Input() phrase: string;
  @Output() answerEvent = new EventEmitter<string>();

  securityPhraseForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.createAnswerForm();
  }

  sendAnswer($event): void {
    this.answerEvent.emit($event.target.value);
  }

  private createAnswerForm(): void {
    this.securityPhraseForm = this.formBuilder.group({
      answer: ['']
    });
  }
}
