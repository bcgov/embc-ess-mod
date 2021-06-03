import { Component, OnInit } from '@angular/core';
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
export class NeedsComponent implements OnInit {
  needsForm: FormGroup;
  tabUpdateSubscription: Subscription;

  constructor(
    private router: Router,
    private stepCreateEssFileService: StepCreateEssFileService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.createNeedsForm();

    // Set "update tab status" method, called for any tab navigation
    this.tabUpdateSubscription = this.stepCreateEssFileService.nextTabUpdate.subscribe(
      () => {
        this.updateTabStatus();
      }
    );
  }

  get needsFormControl(): { [key: string]: AbstractControl } {
    return this.needsForm.controls;
  }

  back(): void {
    this.router.navigate(['/ess-wizard/create-ess-file/animals']);
  }

  next(): void {
    // this.stepCreateEssFileService.nextTabUpdate.next();
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
        this.stepCreateEssFileService.canEvacueeProvideFooD ?? '',
        Validators.required
      ],
      canEvacueeProvideLodging: [
        this.stepCreateEssFileService.canEvacueeProvideLodginG ?? '',
        Validators.required
      ],
      canEvacueeProvideClothing: [
        this.stepCreateEssFileService.canEvacueeProvideClothinG ?? '',
        Validators.required
      ],
      canEvacueeProvideTransportation: [
        this.stepCreateEssFileService.canEvacueeProvideTransportatioN ?? '',
        Validators.required
      ],
      canEvacueeProvideIncidentals: [
        this.stepCreateEssFileService.canEvacueeProvideIncidentalS ?? '',
        Validators.required
      ]
    });
  }

  /**
   * Updates the Tab Status from Incomplete, Complete or in Progress
   */
   private updateTabStatus() {
    if (this.needsForm.valid) {
      this.stepCreateEssFileService.setTabStatus(
        'needs',
        'complete'
      );
    } else if (
      this.stepCreateEssFileService.checkForPartialUpdates(this.needsForm)
    ) {
      this.stepCreateEssFileService.setTabStatus(
        'needs',
        'incomplete'
      );
    } else {
      this.stepCreateEssFileService.setTabStatus(
        'needs',
        'not-started'
      );
    }
    this.saveFormData();
  }

  /**
   * Saves information inserted inthe form into the service
   */
  private saveFormData() {
    // this.stepCreateEssFileService.haveHouseHoldMembers = this.needsForm.get(
    //   'canEvacueeProvideFood'
    // ).value;
    // this.stepCreateEssFileService.houseHoldMembers = this.needsForm.get(
    //   'canEvacueeProvideLodging'
    // ).value;
    // this.stepCreateEssFileService.haveSpecialDieT = this.needsForm.get(
    //   'canEvacueeProvideClothing'
    // ).value;
    // this.stepCreateEssFileService.specialDietDetailS = this.needsForm.get(
    //   'canEvacueeProvideTransportation'
    // ).value;
    // this.stepCreateEssFileService.haveMedicatioN = this.needsForm.get(
    //   'canEvacueeProvideIncidentals'
    // ).value;
    
    // this.stepCreateEssFileService.createNeedsAssessmentDTO();
  }
}
