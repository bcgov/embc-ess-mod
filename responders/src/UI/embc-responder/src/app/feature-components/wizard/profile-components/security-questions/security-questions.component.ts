import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { StepCreateProfileService } from '../../step-create-profile/step-create-profile.service';
import * as globalConst from '../../../../core/services/global-constants';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-security-questions',
  templateUrl: './security-questions.component.html',
  styleUrls: ['./security-questions.component.scss']
})
export class SecurityQuestionsComponent implements OnInit {
  evacueeDetailsForm: FormGroup = null;

  bypassQuestions = false;

  secQuestions = [
    'What was the name of your first pet?',
    'What was your first car’s make and model? (e.g. Ford Taurus)',
    'Where was your first job?',
    'What is your favourite children\'s book?',
    'In what city or town was your mother born?',
    'What is your favourite movie?',
    'What is your oldest sibling\'s middle name?',
    'What month and day is your anniversary?',
    'What was your childhood nickname?',
    'What were the last four digits of your childhood telephone number?',
    'In what town or city did you meet your spouse or partner?'
  ];

  constructor(
    private router: Router,
    private stepCreateProfileService: StepCreateProfileService
  ) {}

  ngOnInit(): void {}
  
  get evacueeFormControl(): { [key: string]: AbstractControl; } {
    return this.evacueeDetailsForm?.controls;
  }

  changeBypass(event:MatCheckboxChange) {
    this.bypassQuestions = event.checked;

    if (!this.bypassQuestions) {
      // Reset dropdowns/inputs
    }
  }

  back(): void {

  }

  next(): void {
    this.stepCreateProfileService.setTabStatus(
      'security-questions',
      'complete'
    );

    if (this.stepCreateProfileService.checkTabsStatus()) {
      this.stepCreateProfileService.openModal(globalConst.wizardProfileMessage);
    } else {
      this.router.navigate(['/ess-wizard/create-evacuee-profile/review']);
    }
  }
}
