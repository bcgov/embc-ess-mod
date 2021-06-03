import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import * as globalConst from '../../../../core/services/global-constants';
import { StepCreateEssFileService } from '../../step-create-ess-file/step-create-ess-file.service';
import { DeleteHouseholdDialogComponent } from '../../../../shared/components/dialog-components/delete-household-dialog/delete-household-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-household-members',
  templateUrl: './household-members.component.html',
  styleUrls: ['./household-members.component.scss']
})
export class HouseholdMembersComponent implements OnInit, OnDestroy {
  householdForm: FormGroup;
  dataSource = new BehaviorSubject([]);
  data = [];
  radioOption: string[] = ['Yes', 'No'];
  editIndex: number;
  rowEdit = false;
  editFlag = false;
  showMemberForm = false;
  displayedColumns: string[] = [
    'firstName',
    'lastName',
    'initials',
    'gender',
    'dateOfBirth',
    'buttons'
  ];
  tabUpdateSubscription: Subscription;

  constructor(
    private dialog: MatDialog,
    private stepCreateEssFileService: StepCreateEssFileService,
    private formBuilder: FormBuilder,
    private customValidation: CustomValidationService,
    private router: Router
  ) {}

  ngOnInit(): void {

    // Main form creation
    this.createHouseholdForm();

    // Populating household members' table if data has been previously inserted
    if (this.stepCreateEssFileService.houseHoldMembers.length !== 0) {
      this.data = this.stepCreateEssFileService.houseHoldMembers;
      this.dataSource.next(this.data);
    }

    // Displaying household member form in case 'haveHouseholdMembers' has been set to true
    if (
      this.stepCreateEssFileService.haveHouseHoldMembers === true &&
      this.stepCreateEssFileService.houseHoldMembers.length === 0
    ) {
      this.showMemberForm = true;
    }

    // Set "update tab status" method, called for any tab navigation
    this.tabUpdateSubscription = this.stepCreateEssFileService.nextTabUpdate.subscribe(
      () => {
        this.updateTabStatus();
      }
    );
  }

  /**
   * Returns the control of the household member form
   */
  public get houseHoldMemberFormGroup(): FormGroup {
    return this.householdForm.get('houseHoldMember') as FormGroup;
  }

  /**
   * Returns the control of the form
   */
  get householdFormControl(): { [key: string]: AbstractControl } {
    return this.householdForm.controls;
  }

  /**
   *
   */
  addMembers(): void {
    this.householdForm.get('houseHoldMember').reset();
    this.showMemberForm = !this.showMemberForm;
    this.editFlag = !this.editFlag;
  }

  /**
   * Allows editing information from inserted household members
   *
   * @param element
   * @param index
   */
  editRow(element, index): void {
    this.editIndex = index;
    this.rowEdit = !this.rowEdit;
    this.householdForm.get('houseHoldMember').setValue(element);
    this.showMemberForm = !this.showMemberForm;
    this.editFlag = !this.editFlag;
  }

  /**
   * Saves householdmembers in the Evacuation File Form
   */
  save(): void {
    if (this.householdForm.get('houseHoldMember').status === 'VALID') {
      if (this.editIndex !== undefined && this.rowEdit) {
        this.data[this.editIndex] = this.householdForm.get(
          'houseHoldMember'
        ).value;
        this.rowEdit = !this.rowEdit;
        this.editIndex = undefined;
      } else {
        this.data.push(this.householdForm.get('houseHoldMember').value);
      }
      this.dataSource.next(this.data);
      this.householdForm.get('houseHoldMembers').setValue(this.data);
      this.householdForm.get('houseHoldMember').reset();
      this.showMemberForm = !this.showMemberForm;
      this.editFlag = !this.editFlag;
    } else {
      this.householdForm.get('houseHoldMember').markAllAsTouched();
    }
  }

  /**
   * Resets the househol Member form and goes back to the main Form
   */
  cancel(): void {
    this.householdForm.get('houseHoldMember').reset();
    this.showMemberForm = !this.showMemberForm;
    this.editFlag = !this.editFlag;

    if (this.data.length === 0) {
      this.householdForm.get('haveHouseholdMembers').setValue(false);
    }
  }

  /**
   * Deletes the selected household member from the table list
   *
   * @param index
   */
  deleteRow(index: number): void {
    this.dialog
      .open(DialogComponent, {
        data: { component: DeleteHouseholdDialogComponent },
        height: 'auto',
        width: '550px'
      })
      .afterClosed()
      .subscribe((event) => {
        if (event === 'delete') {
          this.data.splice(index, 1);
          this.dataSource.next(this.data);
          this.householdForm.get('houseHoldMembers').setValue(this.data);
          if (this.data.length === 0) {
            this.householdForm.get('haveHouseholdMembers').setValue(false);
          }
        }
      });
  }

  /**
   * Listen to changes on Have medication option to display the 72 hours medication supply field
   *
   * @param event
   */
  hasHouseholdMembers(event: MatRadioChange): void {
    if (event.value === 'No') {
      this.showMemberForm = false;
      this.householdForm.get('houseHoldMember').reset();
      this.editFlag = !this.editFlag;
    } else {
      this.showMemberForm = true;
      this.editFlag = !this.editFlag;
    }
  }

  /**
   * Listen to changes on special diet option to display the special diet details field
   *
   * @param event
   */
  hasSpecialDietChange(event: MatRadioChange): void {
    if (event.value === 'No') {
      this.householdForm.get('specialDietDetails').reset();
    }
  }

  /**
   * Listen to changes on medication option to show the 72 hours supply option
   *
   * @param event
   */
  hasMedicationChange(event: MatRadioChange): void {
    if (event.value === 'No') {
      this.householdForm.get('medicationSupply').reset();
    }
  }

  back(): void {
    this.router.navigate(['/ess-wizard/create-ess-file/evacuation-details']);
  }
  next(): void {
    this.router.navigate(['/ess-wizard/create-ess-file/animals']);
  }

  /**
   * When navigating away from tab, update variable value and status indicator
   */
  ngOnDestroy(): void {
    this.stepCreateEssFileService.nextTabUpdate.next();
    this.tabUpdateSubscription.unsubscribe();
  }

  private createHouseholdForm(): void {
    if (!this.stepCreateEssFileService.houseHoldMembers)
      this.stepCreateEssFileService.houseHoldMembers = [];

    this.householdForm = this.formBuilder.group({
      hasHouseholdMembers: [
        this.stepCreateEssFileService.haveHouseHoldMembers ?? '',
        Validators.required
      ],
      houseHoldMembers: [
        this.stepCreateEssFileService.houseHoldMembers,
        this.customValidation
          .conditionalValidation(
            () => this.householdForm.get('hasHouseholdMembers').value === 'Yes',
            Validators.required
          )
          .bind(this.customValidation)
      ],
      houseHoldMember: this.createHoulseholdMemberForm(),
      hasSpecialDiet: [
        this.stepCreateEssFileService.haveSpecialDieT ?? '',
        Validators.required
      ],
      specialDietDetails: [
        this.stepCreateEssFileService.specialDietDetailS ?? '',
        [
          this.customValidation
            .conditionalValidation(
              () => this.householdForm.get('hasSpecialDiet').value === 'Yes',
              this.customValidation.whitespaceValidator()
            )
            .bind(this.customValidation)
        ]
      ],
      hasMedication: [
        this.stepCreateEssFileService.haveMedicatioN ?? '',
        Validators.required
      ],
      medicationSupply: [
        this.stepCreateEssFileService.medicationSupplY ?? '',
        [
          this.customValidation
            .conditionalValidation(
              () => this.householdForm.get('hasMedication').value === 'Yes',
              Validators.required
            )
            .bind(this.customValidation)
        ]
      ]
    });
  }

  private createHoulseholdMemberForm(): FormGroup {
    return this.formBuilder.group({
      firstName: ['', [this.customValidation.whitespaceValidator()]],
      lastName: ['', [this.customValidation.whitespaceValidator()]],
      dateOfBirth: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      initials: [''],
      preferredName: [''],
      sameLastNameCheck: ['']
    });
  }

  /**
   * Updates the Tab Status from Incomplete, Complete or in Progress
   */
  private updateTabStatus() {
    if (this.householdForm.valid) {
      this.stepCreateEssFileService.setTabStatus(
        'household-members',
        'complete'
      );
    } else if (
      this.stepCreateEssFileService.checkForPartialUpdates(this.householdForm)
    ) {
      this.stepCreateEssFileService.setTabStatus(
        'household-members',
        'incomplete'
      );
    } else {
      this.stepCreateEssFileService.setTabStatus(
        'household-members',
        'not-started'
      );
    }
    this.saveFormData();
  }

  /**
   * Saves information inserted inthe form into the service
   */
  private saveFormData() {

    this.stepCreateEssFileService.haveHouseHoldMembers = this.householdForm.get(
      'hasHouseholdMembers'
    ).value;
    this.stepCreateEssFileService.houseHoldMembers = this.householdForm.get(
      'houseHoldMembers'
    ).value;
    this.stepCreateEssFileService.haveSpecialDieT = this.householdForm.get(
      'hasSpecialDiet'
    ).value;
    this.stepCreateEssFileService.specialDietDetailS = this.householdForm.get(
      'specialDietDetails'
    ).value;
    this.stepCreateEssFileService.haveMedicatioN = this.householdForm.get(
      'hasMedication'
    ).value;
    this.stepCreateEssFileService.medicationSupplY = this.householdForm.get(
      'medicationSupply'
    ).value;

    this.stepCreateEssFileService.createNeedsAssessmentDTO();
  }
}
