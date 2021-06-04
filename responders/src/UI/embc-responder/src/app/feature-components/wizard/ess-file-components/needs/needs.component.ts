import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { StepCreateEssFileService } from '../../step-create-ess-file/step-create-ess-file.service';

@Component({
  selector: 'app-needs',
  templateUrl: './needs.component.html',
  styleUrls: ['./needs.component.scss']
})
export class NeedsComponent implements OnInit, OnDestroy {
  needsForm: FormGroup;
  tabUpdateSubscription: Subscription;

  constructor(
    private router: Router,
    private stepCreateEssFileService: StepCreateEssFileService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    // Creates the main form
    this.createNeedsForm();

    // Set "update tab status" method, called for any tab navigation
    this.tabUpdateSubscription = this.stepCreateEssFileService.nextTabUpdate.subscribe(
      () => {
        this.updateTabStatus();
      }
    );
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
    this.router.navigate(['/ess-wizard/create-ess-file/animals']);
  }

  /**
   * Goes to the next tab from the ESS File
   */
  next(): void {
    this.router.navigate(['/ess-wizard/create-ess-file/review']);
  }

  /**
   * When navigating away from tab, update variable value and status indicator
   */
  ngOnDestroy(): void {
    this.stepCreateEssFileService.nextTabUpdate.next();
    this.tabUpdateSubscription.unsubscribe();
  }

  private createNeedsForm(): void {
    this.needsForm = this.formBuilder.group({
      canEvacueeProvideFood: [
        this.stepCreateEssFileService.canEvacueeProvideFood ?? '',
        Validators.required
      ],
      canEvacueeProvideLodging: [
        this.stepCreateEssFileService.canEvacueeProvideLodging ?? '',
        Validators.required
      ],
      canEvacueeProvideClothing: [
        this.stepCreateEssFileService.canEvacueeProvideClothing ?? '',
        Validators.required
      ],
      canEvacueeProvideTransportation: [
        this.stepCreateEssFileService.canEvacueeProvideTransportation ?? '',
        Validators.required
      ],
      canEvacueeProvideIncidentals: [
        this.stepCreateEssFileService.canEvacueeProvideIncidentals ?? '',
        Validators.required
      ]
    });
  }

  /**
   * Updates the Tab Status from Incomplete, Complete or in Progress
   */
  private updateTabStatus() {
    if (this.needsForm.valid) {
      this.stepCreateEssFileService.setTabStatus('needs', 'complete');
    } else if (
      this.stepCreateEssFileService.checkForPartialUpdates(this.needsForm)
    ) {
      this.stepCreateEssFileService.setTabStatus('needs', 'incomplete');
    } else {
      this.stepCreateEssFileService.setTabStatus('needs', 'not-started');
    }
    this.saveFormData();
  }

  /**
   * Saves information inserted inthe form into the service
   */
  private saveFormData() {
    this.stepCreateEssFileService.canEvacueeProvideFood = this.needsForm.get(
      'canEvacueeProvideFood'
    ).value;
    this.stepCreateEssFileService.canEvacueeProvideLodging = this.needsForm.get(
      'canEvacueeProvideLodging'
    ).value;
    this.stepCreateEssFileService.canEvacueeProvideClothing = this.needsForm.get(
      'canEvacueeProvideClothing'
    ).value;
    this.stepCreateEssFileService.canEvacueeProvideTransportation = this.needsForm.get(
      'canEvacueeProvideTransportation'
    ).value;
    this.stepCreateEssFileService.canEvacueeProvideIncidentals = this.needsForm.get(
      'canEvacueeProvideIncidentals'
    ).value;

    this.stepCreateEssFileService.createNeedsAssessmentDTO();
  }
}
