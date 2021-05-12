import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-security-phrase-card',
  templateUrl: './security-phrase-card.component.html',
  styleUrls: ['./security-phrase-card.component.scss']
})
export class SecurityPhraseCardComponent implements OnInit {
  @Input() phrase: string;
  @Output() answerEvent = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {}

  sendAnswer($event): void {
    this.answerEvent.emit($event.target.value);
  }
}
