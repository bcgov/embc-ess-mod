import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { StepEssFileService } from '../../step-ess-file/step-ess-file.service';
import * as globalConst from '../../../../core/services/global-constants';
import { WizardService } from '../../wizard.service';

@Component({
  selector: 'app-needs',
  templateUrl: './needs.component.html',
  styleUrls: ['./needs.component.scss']
})
export class NeedsComponent implements OnInit, OnDestroy {
  needsForm: FormGroup;
  radioOption = globalConst.needsOptions;
  tabUpdateSubscription: Subscription;

  constructor(
    private router: Router,
    private stepEssFileService: StepEssFileService,
    private formBuilder: FormBuilder,
    private wizardService: WizardService
  ) {}

  ngOnInit(): void {
    // Creates the main form
    this.createNeedsForm();

    // Set "update tab status" method, called for any tab navigation
    this.tabUpdateSubscription =
      this.stepEssFileService.nextTabUpdate.subscribe(() => {
        this.updateTabStatus();
      });
  }

  /**
   * Returns the control of the form
   */
  get needsFormControl(): { [key: string]: AbstractControl } {
    return this.needsForm.controls;
  }

  /**
   * Goes back to the previous ESS File Tab
   */
  back(): void {
    this.router.navigate(['/ess-wizard/ess-file/animals']);
  }

  /**
   * Goes to the next tab from the ESS File
   */
  next(): void {
    this.router.navigate(['/ess-wizard/ess-file/security-phrase']);
  }

  /**
   * When navigating away from tab, update variable value and status indicator
   */
  ngOnDestroy(): void {
    if (this.stepEssFileService.checkForEdit()) {
      const isFormUpdated = this.wizardService.hasChanged(
        this.needsForm.controls,
        'needs'
      );

      this.wizardService.setEditStatus({
        tabName: 'needs',
        tabUpdateStatus: isFormUpdated
      });
      this.stepEssFileService.updateEditedFormStatus();
    }
    this.stepEssFileService.nextTabUpdate.next();
    this.tabUpdateSubscription.unsubscribe();
  }

  private createNeedsForm(): void {
    this.needsForm = this.formBuilder.group({
      canEvacueeProvideFood: [
        this.stepEssFileService.canRegistrantProvideFood ?? '',
        Validators.required
      ],
      canEvacueeProvideLodging: [
        this.stepEssFileService.canRegistrantProvideLodging ?? '',
        Validators.required
      ],
      canEvacueeProvideClothing: [
        this.stepEssFileService.canRegistrantProvideClothing ?? '',
        Validators.required
      ],
      canEvacueeProvideTransportation: [
        this.stepEssFileService.canRegistrantProvideTransportation ?? '',
        Validators.required
      ],
      canEvacueeProvideIncidentals: [
        this.stepEssFileService.canRegistrantProvideIncidentals ?? '',
        Validators.required
      ]
    });
  }

  /**
   * Updates the Tab Status from Incomplete, Complete or in Progress
   */
  private updateTabStatus() {
    if (this.needsForm.valid) {
      this.stepEssFileService.setTabStatus('needs', 'complete');
    } else if (this.stepEssFileService.checkForPartialUpdates(this.needsForm)) {
      this.stepEssFileService.setTabStatus('needs', 'incomplete');
    } else {
      this.stepEssFileService.setTabStatus('needs', 'not-started');
    }
    this.saveFormData();
  }

  /**
   * Saves information inserted inthe form into the service
   */
  private saveFormData() {
    this.stepEssFileService.canRegistrantProvideFood = this.needsForm.get(
      'canEvacueeProvideFood'
    ).value;
    this.stepEssFileService.canRegistrantProvideLodging = this.needsForm.get(
      'canEvacueeProvideLodging'
    ).value;
    this.stepEssFileService.canRegistrantProvideClothing = this.needsForm.get(
      'canEvacueeProvideClothing'
    ).value;
    this.stepEssFileService.canRegistrantProvideTransportation =
      this.needsForm.get('canEvacueeProvideTransportation').value;
    this.stepEssFileService.canRegistrantProvideIncidentals =
      this.needsForm.get('canEvacueeProvideIncidentals').value;
  }
}
