import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppBaseService } from 'src/app/core/services/helper/appBase.service';
import { RestrictionService } from './restriction.service';
import { MatButton } from '@angular/material/button';
import { MatError } from '@angular/material/form-field';

import { MatRadioGroup, MatRadioButton } from '@angular/material/radio';

@Component({
  selector: 'app-restriction',
  templateUrl: './restriction.component.html',
  styleUrls: ['./restriction.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatRadioGroup, MatRadioButton, MatError, MatButton]
})
export class RestrictionComponent implements OnInit, OnDestroy {
  restrictionForm: UntypedFormGroup;
  tabUpdateSubscription: Subscription;
  editFlag: boolean;

  constructor(
    private router: Router,
    private restrictionService: RestrictionService,
    private appBaseService: AppBaseService
  ) {}

  ngOnInit(): void {
    this.restrictionService.init();
    this.restrictionForm = this.restrictionService.createForm();
    this.editFlag = this.appBaseService?.wizardProperties?.editFlag;
    this.tabUpdateSubscription = this.restrictionService.updateTabStatus(this.restrictionForm);
  }

  /**
   * Returns the control of the form
   */
  get restrFormControl(): { [key: string]: AbstractControl } {
    return this.restrictionForm.controls;
  }

  /**
   * Navigate to next tab
   */
  next(): void {
    this.router.navigate([this.restrictionService?.tabMetaData?.next]);
  }

  /**
   * Navigates to the previous tab
   */
  back(): void {
    this.router.navigate([this.restrictionService?.tabMetaData?.previous]);
  }

  /**
   * When navigating away from tab, update variable value and status indicator
   */
  ngOnDestroy(): void {
    this.restrictionService.cleanup(this.restrictionForm);
    this.tabUpdateSubscription.unsubscribe();
  }
}
