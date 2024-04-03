import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, combineLatest } from 'rxjs';
import { StepEssFileService } from '../../step-ess-file/step-ess-file.service';
import * as globalConst from '../../../../core/services/global-constants';
import { WizardService } from '../../wizard.service';
import { TabModel } from 'src/app/core/models/tab.model';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
import { startWith } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../../../shared/components/dialog/dialog.component';
import { InformationDialogComponent } from '../../../../shared/components/dialog-components/information-dialog/information-dialog.component';
import { needsShelterAllowanceMessage, needsShelterReferralMessage, needsIncidentalMessage } from '../../../../core/services/global-constants';
import { IdentifiedNeed } from 'src/app/core/api/models';

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
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // Creates the main form
    this.createNeedsForm();

    // Creates conditional checkbox and radio logic
    this.noAssistanceRequiredChecked();
    this.assistanceRequiredChecked();

    // Set "update tab status" method, called for any tab navigation
    this.tabUpdateSubscription =
      this.stepEssFileService.nextTabUpdate.subscribe(() => {
        this.saveFormData();
        this.updateTabStatus();
      });

    this.needsForm.get('doesEvacueeNotRequireAssistance').setValue(this.stepEssFileService.doesEvacueeNotRequireAssistance);

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

  /**
   * Creates the form with the fields and validations
   */
  private createNeedsForm(): void {
    this.needsForm = this.formBuilder.group({
      doesEvacueeNotRequireAssistance: [
        this.stepEssFileService.doesEvacueeNotRequireAssistance ? this.stepEssFileService.doesEvacueeNotRequireAssistance : false,
        Validators.required
      ],
      canEvacueeProvideFood: [
        this.stepEssFileService.isNeedIdentified(IdentifiedNeed.Food),
        Validators.required
      ],
      canEvacueeProvideShelter: [
        this.stepEssFileService.canEvacueeProvideShelter ? this.stepEssFileService.canEvacueeProvideShelter : false,
        Validators.required
      ],
      shelterOptions: [
        this.stepEssFileService.isNeedIdentified(IdentifiedNeed.ShelterAllowance) 
          ? 'Lodging - Shelter Allowance' 
          : (this.stepEssFileService.isNeedIdentified(IdentifiedNeed.ShelterReferral) 
            ? 'Lodging - Shelter Referral' : ''),
        Validators.required
      ],
      canEvacueeProvideClothing: [
        this.stepEssFileService.isNeedIdentified(IdentifiedNeed.Clothing),
        Validators.required
      ],
      canEvacueeProvideTransportation: [
        this.stepEssFileService.isNeedIdentified(IdentifiedNeed.Tranportation),
        Validators.required
      ],
      canEvacueeProvideIncidentals: [
        this.stepEssFileService.isNeedIdentified(IdentifiedNeed.Incidentals),
        Validators.required
      ]
    });
  }

  /**
   * Subscribes to changes in the form and updates the doesEvacueeNotRequireAssistance checkbox
   */
  private noAssistanceRequiredChecked() {
    this.needsForm.get('doesEvacueeNotRequireAssistance').valueChanges.subscribe(value => {
      if (value) {
        // If doesEvacueeNotRequireAssistance is true, set all other form controls to false and disable them
        Object.keys(this.needsForm.controls).forEach(key => {
          if (key !== 'doesEvacueeNotRequireAssistance') {
            this.needsForm.get(key).setValue(false, {emitEvent: false});
            this.needsForm.get(key).disable({emitEvent: false});
          }
        });
      } else {
        // If doesEvacueeNotRequireAssistance is false, enable all other form controls
        Object.keys(this.needsForm.controls).forEach(key => {
          if (key !== 'doesEvacueeNotRequireAssistance') {
            this.needsForm.get(key).enable({emitEvent: false});
          }
        });
      }
    });
  }

  /**
   * Subscribes to changes in the form and updates the doesEvacueeNotRequireAssistance checkbox
   */
  private assistanceRequiredChecked() {
    // Subscribe to changes in all other checkboxes
    const otherCheckboxes = Object.keys(this.needsForm.controls)
      .filter(key => key !== 'doesEvacueeNotRequireAssistance')
      .map(key => this.needsForm.get(key).valueChanges.pipe(startWith(this.needsForm.get(key).value)));

    // Combine the changes and update the doesEvacueeNotRequireAssistance checkbox
    combineLatest(otherCheckboxes).subscribe(values => {
      let doesEvacueeNotRequireAssistance = this.needsForm.get('doesEvacueeNotRequireAssistance');
      if (values.some(value => value)) {
        doesEvacueeNotRequireAssistance.setValue(false, {emitEvent: false});        
        doesEvacueeNotRequireAssistance.disable({emitEvent: false});
      }
      else {
        doesEvacueeNotRequireAssistance.enable({emitEvent: false});
      }      
    });
  }
  
  /**
   * Opens a dialog with information about shelter allowance.
   */
  openShelterAllowanceDialog(): void {
    this.dialog.open(DialogComponent, {
      data: {
        component: InformationDialogComponent,
        content: needsShelterAllowanceMessage
      },
      width: '630px'
    });
  }

  /**
   * Opens a dialog with information about shelter referral.
   */
  openShelterReferralDialog(): void {
    this.dialog.open(DialogComponent, {
      data: {
        component: InformationDialogComponent,
        content: needsShelterReferralMessage
      },
      width: '630px'
    });
  }

  /**
   * Opens a dialog with information about incidentals.
   */
  openIncidentalsDialog(): void {
    this.dialog.open(DialogComponent, {
      data: {
        component: InformationDialogComponent,
        content: needsIncidentalMessage
      },
      width: '630px'
    });
  }

  /**
   * Updates the Tab Status from Incomplete, Complete or in Progress
   */
  private updateTabStatus() {
    const canEvacueeProvideShelter = this.needsForm.get('canEvacueeProvideShelter').value;
    const doesEvacueeNotRequireAssistance = this.needsForm.get('doesEvacueeNotRequireAssistance').value;

    if(!doesEvacueeNotRequireAssistance && !this.isAnyRegularNeedsIdentified() && !canEvacueeProvideShelter) {
      // nothing checked - not started
      this.stepEssFileService.setTabStatus('needs', 'not-started');

    } else if(doesEvacueeNotRequireAssistance && (this.isAnyRegularNeedsIdentified() || canEvacueeProvideShelter)) {
      // doesEvacueeNotRequireAssistance checked along with other checkboxes - error
      this.stepEssFileService.setTabStatus('needs', 'incomplete');

    } else if (!this.isRadioSelectedIfShelterIsChecked()) {
      // radio is not selected while shelter checkbox is ticked - valid
      this.stepEssFileService.setTabStatus('needs', 'incomplete');

    } else if (!doesEvacueeNotRequireAssistance && (this.isAnyRegularNeedsIdentified() 
                || canEvacueeProvideShelter && this.isRadioSelectedIfShelterIsChecked())) {
      // doesEvacueeNotRequireAssistance not checked and any regular needs checked or shelter option checked - valid
      this.stepEssFileService.setTabStatus('needs', 'complete');

    } else if (doesEvacueeNotRequireAssistance && !this.isAnyRegularNeedsIdentified() && !canEvacueeProvideShelter) {
      // only doesEvacueeNotRequireAssistance checked - valid
      this.stepEssFileService.setTabStatus('needs', 'complete');

    } else {
      // default
      this.stepEssFileService.setTabStatus('needs', 'not-started');
    }

    this.saveFormData();
  }
  
  /**
   * @returns true if any of the regular needs are identified
   */
  isAnyRegularNeedsIdentified() { 
    return this.stepEssFileService.isNeedIdentified(IdentifiedNeed.Food) 
      || this.stepEssFileService.isNeedIdentified(IdentifiedNeed.Clothing) 
      || this.stepEssFileService.isNeedIdentified(IdentifiedNeed.Tranportation) 
      || this.stepEssFileService.isNeedIdentified(IdentifiedNeed.Incidentals);
  }
  
  /**
   * @returns true if the radio button is selected while the shelter checkbox is checked or shelter checkbox is not checked
   */
  isRadioSelectedIfShelterIsChecked() {
    const canEvacueeProvideShelter = this.needsForm.get('canEvacueeProvideShelter').value;

    if (!canEvacueeProvideShelter) {
      return true;
    } else if (canEvacueeProvideShelter 
        && (this.stepEssFileService.isNeedIdentified(IdentifiedNeed.ShelterAllowance) 
          || this.stepEssFileService.isNeedIdentified(IdentifiedNeed.ShelterReferral))) {
      return true;
    } else {
      return false
    }
  }

  /**
   * Saves information inserted in the form into the service
   */
  private saveFormData() {
    this.stepEssFileService.doesEvacueeNotRequireAssistance = this.needsForm.get('doesEvacueeNotRequireAssistance').value;
    this.stepEssFileService.canEvacueeProvideShelter = this.needsForm.get('canEvacueeProvideShelter').value;
    
    if(this.needsForm.get('doesEvacueeNotRequireAssistance').value) {
      this.stepEssFileService.clearNeeds();
    } else {
      if (this.needsForm.get('canEvacueeProvideFood').value) {
        this.stepEssFileService.setNeed(IdentifiedNeed.Food);
      } 
      if (this.needsForm.get('canEvacueeProvideIncidentals').value) {
        this.stepEssFileService.setNeed(IdentifiedNeed.Incidentals);
      }
      if (this.needsForm.get('canEvacueeProvideClothing').value) {
        this.stepEssFileService.setNeed(IdentifiedNeed.Clothing);
      }
      if (this.needsForm.get('canEvacueeProvideTransportation').value) {
        this.stepEssFileService.setNeed(IdentifiedNeed.Tranportation);
      }
      if (this.needsForm.get('shelterOptions').value === 'Lodging - Shelter Allowance') {
        this.stepEssFileService.setNeed(IdentifiedNeed.ShelterAllowance);
      }
      if (this.needsForm.get('shelterOptions').value === 'Lodging - Shelter Referral') {
        this.stepEssFileService.setNeed(IdentifiedNeed.ShelterReferral);
      }
    }
  }
}
