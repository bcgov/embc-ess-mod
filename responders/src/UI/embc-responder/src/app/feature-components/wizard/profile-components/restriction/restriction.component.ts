import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TabModel } from 'src/app/core/models/tab.model';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
import { StepEvacueeProfileService } from '../../step-evacuee-profile/step-evacuee-profile.service';
import { WizardService } from '../../wizard.service';

@Component({
  selector: 'app-restriction',
  templateUrl: './restriction.component.html',
  styleUrls: ['./restriction.component.scss']
})
export class RestrictionComponent implements OnInit, OnDestroy {
  restrictionForm: FormGroup;
  tabUpdateSubscription: Subscription;
  editFlag: boolean;
  tabMetaData: TabModel;

  constructor(
    private router: Router,
    private stepEvacueeProfileService: StepEvacueeProfileService,
    private formBuilder: FormBuilder,
    private wizardService: WizardService,
    private evacueeSessionService: EvacueeSessionService
  ) {}

  ngOnInit(): void {
    this.createRestrictionForm();
    this.editFlag = this.evacueeSessionService.getEditWizardFlag();

    // Set "update tab status" method, called for any tab navigation
    this.tabUpdateSubscription =
      this.stepEvacueeProfileService.nextTabUpdate.subscribe(() => {
        this.updateTabStatus();
      });
    this.tabMetaData =
      this.stepEvacueeProfileService.getNavLinks('restriction');
  }

  createRestrictionForm(): void {
    this.restrictionForm = this.formBuilder.group({
      restrictedAccess: [
        this.stepEvacueeProfileService.restrictedAccess !== null
          ? this.stepEvacueeProfileService.restrictedAccess
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
    this.router.navigate([this.tabMetaData?.next]);
  }

  /**
   * Navigates to the previous tab
   */
  back(): void {
    this.router.navigate([this.tabMetaData?.previous]);
  }

  /**
   * Checks the form validity and updates the tab status
   */
  updateTabStatus() {
    if (this.restrictionForm.valid) {
      this.stepEvacueeProfileService.setTabStatus('restriction', 'complete');
    }
    this.stepEvacueeProfileService.restrictedAccess =
      this.restrictionForm.get('restrictedAccess').value;
  }

  /**
   * When navigating away from tab, update variable value and status indicator
   */
  ngOnDestroy(): void {
    if (this.stepEvacueeProfileService.checkForEdit()) {
      const isFormUpdated = this.wizardService.hasChanged(
        this.restrictionForm.controls,
        'restriction'
      );

      this.wizardService.setEditStatus({
        tabName: 'restriction',
        tabUpdateStatus: isFormUpdated
      });
      this.stepEvacueeProfileService.updateEditedFormStatus();
    }
    this.stepEvacueeProfileService.nextTabUpdate.next();
    this.tabUpdateSubscription.unsubscribe();
  }
}
