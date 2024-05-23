import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GetSecurityPhraseResponse } from 'src/app/core/api/models';

import { MatInput } from '@angular/material/input';
import { MatFormField, MatError } from '@angular/material/form-field';
import { MatCard, MatCardContent } from '@angular/material/card';

@Component({
  selector: 'app-security-phrase-card',
  templateUrl: './security-phrase-card.component.html',
  styleUrls: ['./security-phrase-card.component.scss'],
  standalone: true,
  imports: [MatCard, MatCardContent, FormsModule, ReactiveFormsModule, MatFormField, MatInput, MatError]
})
export class SecurityPhraseCardComponent {
  @Input() phrase: GetSecurityPhraseResponse;
  @Input() parentForm: UntypedFormGroup;

  /**
   * Return form control
   */
  get securityPhraseFormControl(): { [key: string]: AbstractControl } {
    return this.parentForm.controls;
  }
}
