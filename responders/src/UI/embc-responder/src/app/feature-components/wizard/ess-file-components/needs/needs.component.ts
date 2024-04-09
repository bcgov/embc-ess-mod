import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { StepEssFileService } from '../../step-ess-file/step-ess-file.service';
import * as globalConst from '../../../../core/services/global-constants';
import { WizardService } from '../../wizard.service';
import { TabModel } from 'src/app/core/models/tab.model';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogContent } from 'src/app/core/models/dialog-content.model';
import { InformationDialogComponent } from 'src/app/shared/components/dialog-components/information-dialog/information-dialog.component';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';

enum ShelterType {
  allowance = 'shelterAllowance',
  referral = 'shelterReferral'
}

@Component({
  selector: 'app-needs',
  templateUrl: './needs.component.html',
  styleUrls: ['./needs.component.scss']
})
export class NeedsComponent implements OnInit, OnDestroy {
  needsForm: UntypedFormGroup;
  tabUpdateSubscription: Subscription;
  tabMetaData: TabModel;

  constructor(
    private router: Router,
    private stepEssFileService: StepEssFileService,
    private formBuilder: UntypedFormBuilder,
    private wizardService: WizardService,
    private evacueeSessionService: EvacueeSessionService,
    private customValidationService: CustomValidationService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    // Creates the main form
    this.createNeedsForm();

    // Set "update tab status" method, called for any tab navigation
    this.tabUpdateSubscription =
      this.stepEssFileService.nextTabUpdate.subscribe(() => {
        this.updateTabStatus();
      });

    this.tabMetaData = this.stepEssFileService.getNavLinks('needs');
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
    this.router.navigate([this.tabMetaData?.previous]);
  }

  /**
   * Goes to the next tab from the ESS File
   */
  next(): void {
    if (this.evacueeSessionService.isPaperBased) {
      this.stepEssFileService.nextTabUpdate.next();

      if (this.stepEssFileService.checkTabsStatus()) {
        this.stepEssFileService.openModal(globalConst.wizardESSFileMessage);
      } else {
        this.router.navigate([this.tabMetaData?.next]);
      }
    } else {
      this.router.navigate([this.tabMetaData?.next]);
    }
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

  public openShelterAllowanceDialog() {
    this.openInfoDialog(globalConst.shelterAllowanceNeedDialog);
  }

  public openShelterReferralDialog() {
    this.openInfoDialog(globalConst.shelterReferralNeedDialog);
  }

  public openIncidentalsDialog() {
    this.openInfoDialog(globalConst.incidentalsNeedDialog);
  }

  private openInfoDialog(dialog: DialogContent) {
    return this.dialog.open(DialogComponent, {
      data: {
        component: InformationDialogComponent,
        content: dialog
      },
      width: '400px'
    });
  }

  private createNeedsForm(): void {
    this.needsForm = this.formBuilder.group({
      requiresShelter: [
        this.stepEssFileService.requiresShelterAllowance ||
        this.stepEssFileService.requiresShelterReferral
      ],
      requiresShelterType: [
        this.stepEssFileService.requiresShelterReferral
          ? ShelterType.referral
          : this.stepEssFileService.requiresShelterAllowance
            ? ShelterType.allowance
            : undefined
      ],
      requiresFood: [this.stepEssFileService.requiresFood ?? false],
      requiresClothing: [this.stepEssFileService.requiresClothing ?? false],
      requiresTransportation: [
        this.stepEssFileService.requiresTransportation ?? false
      ],
      requiresIncidentals: [
        this.stepEssFileService.requiresIncidentals ?? false
      ],
      requiresNothing: [this.stepEssFileService.requiresNothing ?? false]
    });
    this.needsForm.addValidators(this.customValidationService.needsValidator());
    this.needsFormControl.requiresNothing.valueChanges.subscribe((data) => {
      if (data) {
        this.disableNeeds();
      } else {
        this.enableNeeds();
      }
    });
    if (this.stepEssFileService.requiresNothing) {
      this.disableNeeds();
    }
  }

  private disableNeeds() {
    this.disableFormControl('requiresIncidentals');
    this.disableFormControl('requiresTransportation');
    this.disableFormControl('requiresClothing');
    this.disableFormControl('requiresFood');
    this.disableFormControl('requiresShelter');
    this.disableFormControl('requiresShelterType');
  }

  private enableNeeds() {
    this.enableFormControl('requiresIncidentals');
    this.enableFormControl('requiresTransportation');
    this.enableFormControl('requiresClothing');
    this.enableFormControl('requiresFood');
    this.enableFormControl('requiresShelter');
    this.enableFormControl('requiresShelterType');
  }

  private disableFormControl(formControlName: string) {
    const formControl = this.needsFormControl[formControlName];
    formControl.disable();
    formControl.reset();
  }

  private enableFormControl(formControlName: string) {
    const formControl = this.needsFormControl[formControlName];
    formControl.enable();
    formControl.reset();
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
    this.stepEssFileService.requiresClothing =
      this.needsFormControl.requiresClothing.value;
    this.stepEssFileService.requiresFood =
      this.needsFormControl.requiresFood.value;
    this.stepEssFileService.requiresIncidentals =
      this.needsFormControl.requiresIncidentals.value;
    this.stepEssFileService.requiresTransportation =
      this.needsFormControl.requiresTransportation.value;
    this.stepEssFileService.requiresShelterAllowance =
      this.needsFormControl.requiresShelterType.value === ShelterType.allowance;
    this.stepEssFileService.requiresShelterReferral =
      this.needsFormControl.requiresShelterType.value === ShelterType.referral;
    this.stepEssFileService.requiresNothing =
      this.needsFormControl.requiresNothing.value;
  }
}
