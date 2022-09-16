import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, UntypedFormGroup } from '@angular/forms';
import { GetSecurityPhraseResponse } from 'src/app/core/api/models';

@Component({
  selector: 'app-security-phrase-card',
  templateUrl: './security-phrase-card.component.html',
  styleUrls: ['./security-phrase-card.component.scss']
})
export class SecurityPhraseCardComponent implements OnInit {
  @Input() phrase: GetSecurityPhraseResponse;
  @Input() parentForm: UntypedFormGroup;

  constructor() {}

  ngOnInit(): void {}

  /**
   * Return form control
   */
  get securityPhraseFormControl(): { [key: string]: AbstractControl } {
    return this.parentForm.controls;
  }
}
