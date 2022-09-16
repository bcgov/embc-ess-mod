import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { StepEvacueeProfileService } from '../../step-evacuee-profile/step-evacuee-profile.service';
import * as globalConst from '../../../../core/services/global-constants';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { TabModel } from 'src/app/core/models/tab.model';
import { SecurityQuestionsService } from './security-questions.service';

@Component({
  selector: 'app-security-questions',
  templateUrl: './security-questions.component.html',
  styleUrls: ['./security-questions.component.scss']
})
export class SecurityQuestionsComponent implements OnInit, OnDestroy {
  parentForm: UntypedFormGroup = null;
  questionForm: UntypedFormGroup = null;
  tabUpdateSubscription: Subscription;
  tabMetaData: TabModel;

  constructor(
    private router: Router,
    public stepEvacueeProfileService: StepEvacueeProfileService,
    public securityQuesService: SecurityQuestionsService
  ) {}

  ngOnInit(): void {
    this.questionForm = this.securityQuesService.createForm();
    this.parentForm = this.securityQuesService.createParentForm(
      this.questionForm
    );
    this.questionForm = this.parentForm.get('questionForm') as UntypedFormGroup;

    this.securityQuesService.setFormDisabled(
      this.stepEvacueeProfileService.bypassSecurityQuestions,
      this.questionForm
    );

    //Update value and validity for each security question dropdown when any of the questions change
    this.questionForm
      .get('question1')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        this.questionForm.get('question2').updateValueAndValidity();
        this.questionForm.get('question3').updateValueAndValidity();
      });

    // Set "update tab status" method, called for any tab navigation
    this.tabUpdateSubscription =
      this.stepEvacueeProfileService.nextTabUpdate.subscribe(() => {
        this.securityQuesService.updateTabStatus(this.questionForm);
      });

    this.questionForm
      .get('question2')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        this.questionForm.get('question1').updateValueAndValidity();
        this.questionForm.get('question3').updateValueAndValidity();
      });

    this.questionForm
      .get('question3')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        this.questionForm.get('question1').updateValueAndValidity();
        this.questionForm.get('question2').updateValueAndValidity();
      });

    this.tabMetaData =
      this.stepEvacueeProfileService.getNavLinks('security-questions');
  }

  get parentFormControl(): { [key: string]: AbstractControl } {
    return this.parentForm.controls;
  }

  get questionFormControl(): { [key: string]: AbstractControl } {
    return this.questionForm.controls;
  }

  /**
   * Handle changed state of "Bypass Security Questions" checkbox
   *
   * @param event Mat-checkbox change event, automatically passed in when triggered by form
   */
  bypassCheckboxChanged(event: MatCheckboxChange) {
    this.securityQuesService.setFormDisabled(event.checked, this.questionForm);
  }

  /**
   * Switches security question tab between readonly mode and editable mode
   *
   * @param edit True to set "Edit" mode, False to set "Readonly" mode and clear form
   */
  toggleEditQuestions(edit) {
    this.securityQuesService.toggleEditQuestions(edit, this.questionForm);
  }

  /**
   * Go to the Review tab if all tabs are complete, otherwise open modal
   */
  next(): void {
    this.stepEvacueeProfileService.nextTabUpdate.next();

    if (this.stepEvacueeProfileService.checkTabsStatus()) {
      this.stepEvacueeProfileService.openModal(
        globalConst.wizardProfileMessage
      );
    } else {
      this.router.navigate([this.tabMetaData?.next]);
    }
  }

  /**
   * Go back to the Contact tab
   */
  back(): void {
    this.router.navigate([this.tabMetaData?.previous]);
  }

  /**
   * When navigating away from tab, update variable value and status indicator
   */
  ngOnDestroy(): void {
    this.securityQuesService.cleanup(this.questionForm);
    this.tabUpdateSubscription.unsubscribe();
  }
}
