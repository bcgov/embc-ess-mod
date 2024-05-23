import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ShelterType, StepEssFileService } from '../../step-ess-file/step-ess-file.service';
import * as globalConst from '../../../../core/services/global-constants';
import { WizardService } from '../../wizard.service';
import { TabModel } from 'src/app/core/models/tab.model';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogContent } from 'src/app/core/models/dialog-content.model';
import { InformationDialogComponent } from 'src/app/shared/components/dialog-components/information-dialog/information-dialog.component';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { MatButton } from '@angular/material/button';
import { MatRadioGroup, MatRadioButton } from '@angular/material/radio';

import { MatCheckbox } from '@angular/material/checkbox';

@Component({
  selector: 'app-needs',
  templateUrl: './needs.component.html',
  styleUrls: ['./needs.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatCheckbox, MatRadioGroup, MatRadioButton, MatButton]
})
export class NeedsComponent implements OnInit, OnDestroy {
  needsForm: UntypedFormGroup = this.stepEssFileService.needsForm;
  tabUpdateSubscription: Subscription;
  tabMetaData: TabModel;

  constructor(
    private router: Router,
    private stepEssFileService: StepEssFileService,
    private wizardService: WizardService,
    private evacueeSessionService: EvacueeSessionService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // Set "update tab status" method, called for any tab navigation
    this.tabUpdateSubscription = this.stepEssFileService.nextTabUpdate.subscribe(() => {
      this.updateTabStatus();
    });

    this.tabMetaData = this.stepEssFileService.getNavLinks('needs');
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
      const isFormUpdated = this.wizardService.hasChanged(this.needsForm.controls, 'needs');

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
    this.stepEssFileService.requiresClothing = this.needsForm.controls.requiresClothing.value;
    this.stepEssFileService.requiresFood = this.needsForm.controls.requiresFood.value;
    this.stepEssFileService.requiresIncidentals = this.needsForm.controls.requiresIncidentals.value;
    this.stepEssFileService.requiresTransportation = this.needsForm.controls.requiresTransportation.value;
    this.stepEssFileService.requiresShelterAllowance =
      this.needsForm.controls.requiresShelterType.value === ShelterType.allowance;
    this.stepEssFileService.requiresShelterReferral =
      this.needsForm.controls.requiresShelterType.value === ShelterType.referral;
    this.stepEssFileService.requiresNothing = this.needsForm.controls.requiresNothing.value;
  }
}
