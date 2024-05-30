import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import * as globalConst from '../../../../core/services/global-constants';
import { Subscription } from 'rxjs';
import { AppBaseService } from 'src/app/core/services/helper/appBase.service';
import { EvacueeDetailsService } from './evacuee-details.service';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { IMaskDirective } from 'angular-imask';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';

import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';

@Component({
  selector: 'app-evacuee-details',
  templateUrl: './evacuee-details.component.html',
  styleUrls: ['./evacuee-details.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatSelect,
    MatOption,
    MatError,
    IMaskDirective,
    MatCard,
    MatCardContent,
    MatButton
  ]
})
export class EvacueeDetailsComponent implements OnInit, OnDestroy {
  evacueeDetailsForm: UntypedFormGroup;
  gender = globalConst.gender;
  readonly dateMask = globalConst.dateMask;
  tabUpdateSubscription: Subscription;
  tipText: string;

  constructor(
    private router: Router,
    private appBaseService: AppBaseService,
    public evacueeDetailsService: EvacueeDetailsService
  ) {}

  ngOnInit(): void {
    this.tipText = this.appBaseService?.wizardProperties?.evacueeDetailTipText;
    this.evacueeDetailsService.init();
    this.evacueeDetailsForm = this.evacueeDetailsService.createForm();
    this.evacueeDetailsService.initDisabledFields(this.evacueeDetailsForm);

    this.tabUpdateSubscription = this.evacueeDetailsService.updateTabStatus(this.evacueeDetailsForm);
  }

  /**
   * Returns the control of the form
   */
  get detailsFormControl(): { [key: string]: AbstractControl } {
    return this.evacueeDetailsForm.controls;
  }

  /**
   * Navigate to next tab
   */
  next(): void {
    this.router.navigate([this.evacueeDetailsService?.tabMetaData?.next]);
  }

  /**
   * Navigates to the previous tab
   */
  back(): void {
    this.router.navigate([this.evacueeDetailsService?.tabMetaData?.previous]);
  }

  /**
   * Enables the locked fields
   */
  editLockedFields(): void {
    this.evacueeDetailsService.editLockedFields(this.evacueeDetailsForm);
  }

  /**
   * When navigating away from tab, update variable value and status indicator
   */
  ngOnDestroy(): void {
    this.evacueeDetailsService.cleanup(this.evacueeDetailsForm);
    this.tabUpdateSubscription.unsubscribe();
  }
}
