import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { StepCreateProfileService } from '../../step-create-profile/step-create-profile.service';

@Component({
  selector: 'app-restriction',
  templateUrl: './restriction.component.html',
  styleUrls: ['./restriction.component.scss']
})
export class RestrictionComponent implements OnInit, OnDestroy {
  restrictionForm: FormGroup;
  tabUpdateSubscription: Subscription;

  constructor(
    private router: Router,
    private stepCreateProfileService: StepCreateProfileService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.createRestrictionForm();

    // Set "update tab status" method, called for any tab navigation
    this.tabUpdateSubscription = this.stepCreateProfileService.nextTabUpdate.subscribe(
      () => {
        this.updateTabStatus();
      }
    );
  }

  createRestrictionForm(): void {
    this.restrictionForm = this.formBuilder.group({
      restrictedAccess: [
        this.stepCreateProfileService.restrictedAccess !== null
          ? this.stepCreateProfileService.restrictedAccess
          : '',
        [Validators.required]
      ]
    });
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
    this.router.navigate([
      '/ess-wizard/create-evacuee-profile/evacuee-details'
    ]);
  }

  /**
   * Navigates to the previous tab
   */
  back(): void {
    this.router.navigate([
      '/ess-wizard/create-evacuee-profile/collection-notice'
    ]);
  }

  /**
   * Checks the form validity and updates the tab status
   */
  updateTabStatus() {
    if (this.restrictionForm.valid) {
      this.stepCreateProfileService.setTabStatus('restriction', 'complete');
    }
    this.stepCreateProfileService.restrictedAccess = this.restrictionForm.get(
      'restrictedAccess'
    ).value;
  }

  /**
   * When navigating away from tab, update variable value and status indicator
   */
  ngOnDestroy(): void {
    this.stepCreateProfileService.nextTabUpdate.next();
    this.tabUpdateSubscription.unsubscribe();
  }
}
