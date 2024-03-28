import { Component, OnInit, NgModule, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AbstractControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
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
  booleanOption = globalConst.booleanOptions;

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

    const lodgingCtrl = this.identifyNeedsForm.get('canEvacueeProvideLodging');

    lodgingCtrl.setErrors({ 'error': true });
    this.identifyNeedsForm.updateValueAndValidity();

    this.subscribeShelterRadiosToShelterCheckbox();
    this.assistanceNotRequiredToggled();
    this.anyNeedsToggled();
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
  private subscribeShelterRadiosToShelterCheckbox() {  
    // Subscribe to changes in canEvacueeProvideLodging and update the shelterOptions control
    this.identifyNeedsForm.get('canEvacueeProvideLodging').valueChanges.subscribe(value => {
      const lodgingCtrl = this.identifyNeedsForm.get('canEvacueeProvideLodging');
      const shelterOptionsCtrl = this.identifyNeedsForm.get('shelterOptions');

      if (value === true) {
        lodgingCtrl.setErrors(null);
        shelterOptionsCtrl.setValidators([Validators.required]);
      } else {
        shelterOptionsCtrl.setValue(null);
        shelterOptionsCtrl.clearValidators();
        shelterOptionsCtrl.setValidators([Validators.nullValidator]);
        lodgingCtrl.setErrors({ 'error': true });
      }
      
      // Update the parent form
      this.identifyNeedsForm.updateValueAndValidity();
    });
  }
  
  /**
   * Subscribes to changes in the 'doesEvacueeNotRequireAssistance' control and updates the form.
   */
  private assistanceNotRequiredToggled() {
    
    this.identifyNeedsForm.get('doesEvacueeNotRequireAssistance').valueChanges.subscribe(value => {

      const assistanceRequiredCtrl = this.identifyNeedsForm.get('doesEvacueeNotRequireAssistance');
      const shelterOptionsCtrl = this.identifyNeedsForm.get('shelterOptions');

      if (value === true) {
        [
        'canEvacueeProvideLodging', 
        'canEvacueeProvideFood', 
        'canEvacueeProvideClothing', 
        'canEvacueeProvideIncidentals'
        ].forEach(key => {
            const control = this.identifyNeedsForm.get(key);
            control.setValue(false);
            control.setErrors(null);
            control.disable();
          });
        assistanceRequiredCtrl.setErrors(null);
      } else {
        [
        'canEvacueeProvideLodging', 
        'canEvacueeProvideFood', 
        'canEvacueeProvideClothing', 
        'canEvacueeProvideIncidentals'
        ].forEach(key => {
          const control = this.identifyNeedsForm.get(key);
          control.setValue(false);
          control.setErrors({ 'error': true });
          control.enable();
          });
          assistanceRequiredCtrl.setErrors({ 'error': true });
        }

      shelterOptionsCtrl.setValue(null);
      shelterOptionsCtrl.clearValidators();
      shelterOptionsCtrl.setValidators([Validators.nullValidator]);

      // Update the parent form
      this.identifyNeedsForm.updateValueAndValidity();
    });
  }

  /**
   * Subscribes to changes in the needs checkboxes and updates the 'doesEvacueeNotRequireAssistance' control.
   */
  private anyNeedsToggled() {

    // handling doesEvacueeNotRequireAssistance
    const doesEvacueeNotRequireAssistance = this.identifyNeedsForm.get('doesEvacueeNotRequireAssistance');
    
    const controlNames = [
      'canEvacueeProvideLodging', 
      'canEvacueeProvideFood', 
      'canEvacueeProvideClothing', 
      'canEvacueeProvideIncidentals'
    ];
    
    const needsControls = controlNames.map(key => 
      this.identifyNeedsForm.get(key).valueChanges.pipe(startWith(this.identifyNeedsForm.get(key).value))
    );

    combineLatest(needsControls).subscribe(values => {
      const atLeastOneChecked = values.includes(true);

      if (atLeastOneChecked) {
        doesEvacueeNotRequireAssistance.disable({emitEvent: false});
        doesEvacueeNotRequireAssistance.setErrors(null);  
        doesEvacueeNotRequireAssistance.setValue(false, {emitEvent: false});    
        controlNames.forEach(controlName => {
          this.identifyNeedsForm.get(controlName).setErrors(null);
        });
       } else {
        doesEvacueeNotRequireAssistance.enable({emitEvent: false});
        doesEvacueeNotRequireAssistance.setErrors({ 'error': true });
        controlNames.forEach(controlName => {
          this.identifyNeedsForm.get(controlName).setErrors({ 'error': true });
        });     
      }

      // Update the parent form
      this.identifyNeedsForm.updateValueAndValidity();
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
