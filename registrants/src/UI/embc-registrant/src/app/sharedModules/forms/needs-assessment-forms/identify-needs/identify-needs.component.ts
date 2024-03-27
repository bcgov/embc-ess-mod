import { Component, OnInit, NgModule, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AbstractControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
} from '@angular/forms';
import { FormCreationService } from '../../../../core/services/formCreation.service';
import { Subscription, combineLatest } from 'rxjs';
import { MatRadioModule } from '@angular/material/radio';
import * as globalConst from '../../../../core/services/globalConstants';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/core/components/dialog/dialog.component';
import { InformationDialogComponent } from 'src/app/core/components/dialog-components/information-dialog/information-dialog.component';
import { startWith } from 'rxjs/operators';

@Component({
  selector: 'app-identify-needs',
  templateUrl: './identify-needs.component.html',
  styleUrls: ['./identify-needs.component.scss']
})
export default class IdentifyNeedsComponent implements OnInit {
  identifyNeedsForm: UntypedFormGroup;
  formBuilder: UntypedFormBuilder;
  identifyNeedsForm$: Subscription;
  formCreationService: FormCreationService;
  radioOption = globalConst.needsOptions;

  constructor(
    @Inject('formBuilder') formBuilder: UntypedFormBuilder,
    @Inject('formCreationService') formCreationService: FormCreationService,
    private dialog: MatDialog
  ) {
    this.formBuilder = formBuilder;
    this.formCreationService = formCreationService;
  }

  ngOnInit(): void {
    this.identifyNeedsForm$ = this.formCreationService
    .getIndentifyNeedsForm()
    .subscribe((identifyNeedsForm) => {
      this.identifyNeedsForm = identifyNeedsForm;
    });

    this.subscribeShelterRadiosToCheckbox();
    this.noAssistanceRequiredChecked();
    this.assistanceRequiredChecked();
  }

  get needsFormControl(): { [key: string]: AbstractControl } { 
    return this.identifyNeedsForm.controls;
  }

  /**
   * Opens a dialog with information about incidentals.
   */
  openIncidentalsDialog(): void {
    this.dialog.open(DialogComponent, {
      data: {
        component: InformationDialogComponent,
        content: globalConst.needsIncidentalMessage
      },
      width: '630px'
    });
  }

  /**
   * Opens a dialog with information about shelter allowance.
   */
  openShelterAllowanceDialog(): void {
    this.dialog.open(DialogComponent, {
      data: {
        component: InformationDialogComponent,
        content: globalConst.needsShelterAllowanceMessage
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
        content: globalConst.needsShelterReferralMessage
      },
      width: '630px'
    });
  }

  /**
   * Subscribes to changes in the 'canEvacueeProvideLodging' control and updates the 'shelterOptions' control.
   */
  private subscribeShelterRadiosToCheckbox() {  
    // Subscribe to changes in canEvacueeProvideLodging and update the shelterOptions control
    this.identifyNeedsForm.get('canEvacueeProvideLodging').valueChanges.subscribe(value => {
      const shelterOptionsCtrl = this.identifyNeedsForm.get('shelterOptions');

      if (value === true) {
        shelterOptionsCtrl.setValidators([Validators.required]);
      } else {
        shelterOptionsCtrl.clearValidators();
        shelterOptionsCtrl.setValidators([Validators.nullValidator]);
      }
      
      shelterOptionsCtrl.setValue(null);
      shelterOptionsCtrl.updateValueAndValidity();
    
      // Update the parent form
      this.identifyNeedsForm.updateValueAndValidity();
    });
  }

  private noAssistanceRequiredChecked() {
    this.identifyNeedsForm.get('doesEvacueeNotRequireAssistance').valueChanges.subscribe(value => {
      this.updateFormControls(value);
      this.identifyNeedsForm.updateValueAndValidity();
    });
  }
  
  private assistanceRequiredChecked() {
    const otherCheckboxes = Object.keys(this.identifyNeedsForm.controls)
      .filter(key => key !== 'doesEvacueeNotRequireAssistance')
      .map(key => this.identifyNeedsForm.get(key).valueChanges.pipe(startWith(this.identifyNeedsForm.get(key).value)));

    combineLatest(otherCheckboxes).subscribe(values => {
      const doesEvacueeNotRequireAssistance = this.identifyNeedsForm.get('doesEvacueeNotRequireAssistance');
      if (values.some(value => value === true)) {
        doesEvacueeNotRequireAssistance.setValue(false, {emitEvent: false});        
        doesEvacueeNotRequireAssistance.disable({emitEvent: false});
      } else {
        doesEvacueeNotRequireAssistance.enable({emitEvent: false});
      }
      this.identifyNeedsForm.updateValueAndValidity();
    });
  }
  
  private updateFormControls(value: boolean) {
    Object.keys(this.identifyNeedsForm.controls).forEach(key => {
      if (key !== 'doesEvacueeNotRequireAssistance') {
        value ? this.identifyNeedsForm.get(key).disable({emitEvent: false}) : this.identifyNeedsForm.get(key).enable({emitEvent: false});
      }
    });
  }

}

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatRadioModule
  ],
  declarations: [IdentifyNeedsComponent]
})
class IdentifyNeedsModule {}
