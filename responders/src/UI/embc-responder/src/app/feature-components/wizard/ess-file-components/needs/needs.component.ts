import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  UntypedFormBuilder,
  UntypedFormGroup,
  ValidationErrors,
  ValidatorFn,
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
    this.subscribeShelterRadiosToCheckbox();

    // Set "update tab status" method, called for any tab navigation
    this.tabUpdateSubscription =
      this.stepEssFileService.nextTabUpdate.subscribe(() => {
        this.saveFormData();
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

  /**
   * Creates the form with the fields and validations
   */
  private createNeedsForm(): void {
    this.needsForm = this.formBuilder.group({
      doesEvacueeNotRequireAssistance: [
        this.stepEssFileService.doesEvacueeNotRequireAssistance ?? '',
        Validators.required
      ],
      canEvacueeProvideFood: [
        this.stepEssFileService.canRegistrantProvideFood ?? '',
        Validators.required
      ],
      canEvacueeProvideLodging: [
        this.stepEssFileService.canRegistrantProvideLodging ?? '',
        Validators.required
      ],
      shelterOptions: [
        this.stepEssFileService.shelterOptions ?? '', 
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
   * Subscribes to changes in the 'canEvacueeProvideLodging' control and updates the 'shelterOptions' control.
   */
  private subscribeShelterRadiosToCheckbox() {  
    // Subscribe to changes in canEvacueeProvideLodging and update the shelterOptions control
    this.needsForm.get('canEvacueeProvideLodging').valueChanges.subscribe(value => {
      const shelterOptionsCtrl = this.needsForm.get('shelterOptions');

      if (value) {
        shelterOptionsCtrl.setValidators(Validators.required);
      } else {
        shelterOptionsCtrl.clearValidators();
        shelterOptionsCtrl.setValue(null);
      }

      shelterOptionsCtrl.updateValueAndValidity();
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
    const doesEvacueeNotRequireAssistance = this.needsForm.get('doesEvacueeNotRequireAssistance').value;
    const canEvacueeProvideLodging = this.needsForm.get('canEvacueeProvideLodging').value;
    const lodgingOptions = this.needsForm.get('shelterOptions').value;

    const otherCheckboxes = [
      'canEvacueeProvideLodging', 
      'canEvacueeProvideFood', 
      'canEvacueeProvideClothing', 
      'canEvacueeProvideIncidentals', 
      'canEvacueeProvideTransportation'
    ];

    const otherCheckboxesValues = otherCheckboxes.map(name => this.needsForm.get(name).value);
    const atLeastOneOtherCheckboxChecked = otherCheckboxesValues.some(value => value);

    if (doesEvacueeNotRequireAssistance) {
      this.stepEssFileService.setTabStatus('needs', 'complete');
    } else if (atLeastOneOtherCheckboxChecked) {
      if (canEvacueeProvideLodging && !lodgingOptions) {
        this.stepEssFileService.setTabStatus('needs', 'incomplete');
      } else {
        this.stepEssFileService.setTabStatus('needs', 'complete');
      }
    } else {
      this.stepEssFileService.setTabStatus('needs', 'not-started');
    }
    this.saveFormData();
  }

  /**
   * Saves information inserted in the form into the service
   */
  private saveFormData() {
    this.stepEssFileService.canRegistrantProvideLodging = this.needsForm.get(
      'canEvacueeProvideLodging').value;
    this.stepEssFileService.shelterOptions = this.needsForm.get(
      'shelterOptions').value;
    this.stepEssFileService.canRegistrantProvideFood = this.needsForm.get(
      'canEvacueeProvideFood').value;
    this.stepEssFileService.canRegistrantProvideClothing = this.needsForm.get(
      'canEvacueeProvideClothing').value;
    this.stepEssFileService.canRegistrantProvideIncidentals = this.needsForm.get(
      'canEvacueeProvideIncidentals').value;  
    this.stepEssFileService.canRegistrantProvideTransportation = this.needsForm.get(
      'canEvacueeProvideTransportation').value;
    this.stepEssFileService.doesEvacueeNotRequireAssistance = this.needsForm.get(
      'doesEvacueeNotRequireAssistance').value;
  }
}
