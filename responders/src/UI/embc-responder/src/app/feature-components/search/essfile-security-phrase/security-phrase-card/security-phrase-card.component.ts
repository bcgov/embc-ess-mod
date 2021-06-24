import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GetSecurityPhraseResponse } from 'src/app/core/api/models';

@Component({
  selector: 'app-security-phrase-card',
  templateUrl: './security-phrase-card.component.html',
  styleUrls: ['./security-phrase-card.component.scss']
})
export class SecurityPhraseCardComponent implements OnInit {
  @Input() phrase: GetSecurityPhraseResponse;
  @Input() parentForm: FormGroup;

  constructor() {}

  ngOnInit(): void {}
}
