import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import * as globalConst from '../../../../core/services/global-constants';
import { StepEssFileService } from '../../step-ess-file/step-ess-file.service';
import { Router } from '@angular/router';
import { HouseholdMembersService } from './household-members.service';
import { InformationDialogComponent } from 'src/app/shared/components/dialog-components/information-dialog/information-dialog.component';

@Component({
  selector: 'app-household-members',
  templateUrl: './household-members.component.html',
  styleUrls: ['./household-members.component.scss']
})
export class HouseholdMembersComponent implements OnInit, OnDestroy {
  householdForm: FormGroup;
  dataSource = new BehaviorSubject([]);
  data = [];
  radioOption = globalConst.radioButtonOptions1;
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
    public stepEssFileService: StepEssFileService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private customValidation: CustomValidationService,
    private router: Router,
    private householdService: HouseholdMembersService
  ) {}

  ngOnInit(): void {
    // Main form creation
    this.createHouseholdForm();

    // Populating household members' table if data has been previously inserted
    if (this.stepEssFileService.householdMembers.length !== 0) {
      this.data = this.stepEssFileService.householdMembers;
      this.dataSource.next(this.data);
    }

    // Displaying household member form in case 'haveHouseholdMembers' has been set to true
    if (
      this.stepEssFileService.haveHouseHoldMembers === true &&
      this.stepEssFileService.householdMembers.length === 0
    ) {
      this.showMemberForm = true;
      this.householdForm.get('addMemberIndicator').setValue(true);
    }

    // If the user goes back to the household members tab and left a Personal Details form incomplete, the form is displayed
    if (this.stepEssFileService.addMemberIndicator === true) {
      this.showMemberForm = true;
      this.householdForm.get('houseHoldMember').markAllAsTouched();
    }

    // Set "update tab status" method, called for any tab navigation
    this.tabUpdateSubscription = this.stepEssFileService.nextTabUpdate.subscribe(
      () => {
        this.updateTabStatus();
      }
    );

    // Updates the status of the form according to changes
    this.householdForm
      .get('addMemberIndicator')
      .valueChanges.subscribe(() => this.updateOnVisibility());
    this.householdForm
      .get('hasHouseholdMembers')
      .valueChanges.subscribe(() =>
        this.householdForm.get('houseHoldMembers').updateValueAndValidity()
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
   * Displays the PersonDetails form to add new household members to the form
   */
  addMembers(): void {
    this.householdService.addMembers(this.householdForm);
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
    this.householdService.editRow(this.householdForm, element);
    this.editIndex = index;
    this.rowEdit = !this.rowEdit;
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
      this.householdService.saveHouseholdMember(this.householdForm, this.data);
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
    this.householdService.cancel(this.householdForm);
    this.showMemberForm = !this.showMemberForm;
    this.editFlag = !this.editFlag;

    if (this.data.length === 0) {
      this.householdForm.get('hasHouseholdMembers').setValue(false);
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
        data: {
          component: InformationDialogComponent,
          content: globalConst.householdMemberDeleteDialog
        },
        height: 'auto',
        width: '650px'
      })
      .afterClosed()
      .subscribe((event) => {
        if (event === 'confirm') {
          this.data.splice(index, 1);
          this.dataSource.next(this.data);
          this.householdForm.get('houseHoldMembers').setValue(this.data);
          if (this.data.length === 0) {
            this.householdForm.get('hasHouseholdMembers').setValue(false);
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
    if (event.value === false) {
      this.showMemberForm = false;
      this.householdForm.get('houseHoldMember').reset();
      this.editFlag = !this.editFlag;
      this.householdForm.get('addMemberIndicator').setValue(false);
    } else {
      this.showMemberForm = true;
      this.editFlag = !this.editFlag;
      this.householdForm.get('addMemberIndicator').setValue(true);
    }
  }

  /**
   * Listen to changes on special diet option to display the special diet details field
   *
   * @param event
   */
  hasSpecialDietChange(event: MatRadioChange): void {
    if (event.value === false) {
      this.householdForm.get('specialDietDetails').reset();
    }
  }

  /**
   * Listen to changes on medication option to show the 72 hours supply option
   *
   * @param event
   */
  hasMedicationChange(event: MatRadioChange): void {
    if (event.value === false) {
      this.householdForm.get('medicationSupply').reset();
    }
  }

  /**
   * Goes back to the previous tab from the ESS File Wizard
   */
  back(): void {
    this.router.navigate(['/ess-wizard/ess-file/evacuation-details']);
  }

  /**
   * Goes to the next tab from the ESS File Wizard
   */
  next(): void {
    this.router.navigate(['/ess-wizard/ess-file/animals']);
  }

  /**
   * When navigating away from tab, update variable value and status indicator
   */
  ngOnDestroy(): void {
    this.stepEssFileService.nextTabUpdate.next();
    this.tabUpdateSubscription.unsubscribe();
  }

  /**
   * Create Household Members main form
   */
  private createHouseholdForm(): void {
    if (!this.stepEssFileService.householdMembers)
      this.stepEssFileService.householdMembers = [];

    this.householdForm = this.formBuilder.group({
      hasHouseholdMembers: [
        this.stepEssFileService.haveHouseHoldMembers,
        Validators.required
      ],
      houseHoldMembers: [
        this.stepEssFileService.householdMembers,
        this.customValidation
          .conditionalValidation(
            () => this.householdForm.get('hasHouseholdMembers').value === true,
            Validators.required
          )
          .bind(this.customValidation)
      ],
      houseHoldMember: this.createHouseholdMemberForm(),
      hasSpecialDiet: [
        this.stepEssFileService.haveSpecialDiet,
        Validators.required
      ],
      specialDietDetails: [
        this.stepEssFileService.specialDietDetails ?? '',
        [
          this.customValidation
            .conditionalValidation(
              () => this.householdForm.get('hasSpecialDiet').value === true,
              this.customValidation.whitespaceValidator()
            )
            .bind(this.customValidation)
        ]
      ],
      hasMedication: [
        this.stepEssFileService.takeMedication,
        Validators.required
      ],
      medicationSupply: [
        this.stepEssFileService.haveMedicationSupply,
        [
          this.customValidation
            .conditionalValidation(
              () => this.householdForm.get('hasMedication').value === true,
              Validators.required
            )
            .bind(this.customValidation)
        ]
      ],
      addMemberIndicator: [false]
    });
  }

  /**
   * Creates household member form to insert household members
   *
   * @returns a PersonalDetails form
   */
  private createHouseholdMemberForm(): FormGroup {
    return this.formBuilder.group({
      firstName: [
        '',
        [
          this.customValidation
            .conditionalValidation(
              () => this.householdForm.get('addMemberIndicator').value === true,
              this.customValidation.whitespaceValidator()
            )
            .bind(this.customValidation)
        ]
      ],
      lastName: [
        '',
        [
          this.customValidation
            .conditionalValidation(
              () => this.householdForm.get('addMemberIndicator').value === true,
              this.customValidation.whitespaceValidator()
            )
            .bind(this.customValidation)
        ]
      ],
      dateOfBirth: [
        '',
        [
          this.customValidation
            .conditionalValidation(
              () => this.householdForm.get('addMemberIndicator').value === true,
              Validators.required
            )
            .bind(this.customValidation)
        ]
      ],
      gender: [
        '',
        [
          this.customValidation
            .conditionalValidation(
              () => this.householdForm.get('addMemberIndicator').value === true,
              Validators.required
            )
            .bind(this.customValidation)
        ]
      ],
      initials: [''],
      preferredName: [''],
      sameLastNameCheck: ['']
    });
  }

  /**
   * Updates the validations for personalDetailsForm
   */
  private updateOnVisibility(): void {
    this.householdService.updateOnVisibility(this.householdForm);
  }

  /**
   * Updates the Tab Status from Incomplete, Complete or in Progress
   */
  private updateTabStatus() {
    if (this.householdForm.valid) {
      this.stepEssFileService.setTabStatus('household-members', 'complete');
    } else if (
      this.stepEssFileService.checkForPartialUpdates(this.householdForm)
    ) {
      this.stepEssFileService.setTabStatus('household-members', 'incomplete');
    } else {
      this.stepEssFileService.setTabStatus('household-members', 'not-started');
    }
    this.saveFormData();
  }

  /**
   * Saves information inserted inthe form into the service
   */
  private saveFormData() {
    this.stepEssFileService.haveHouseHoldMembers = this.householdForm.get(
      'hasHouseholdMembers'
    ).value;
    this.stepEssFileService.householdMembers = this.householdForm.get(
      'houseHoldMembers'
    ).value;
    this.stepEssFileService.haveSpecialDiet = this.householdForm.get(
      'hasSpecialDiet'
    ).value;
    this.stepEssFileService.specialDietDetails = this.householdForm.get(
      'specialDietDetails'
    ).value;
    this.stepEssFileService.takeMedication = this.householdForm.get(
      'hasMedication'
    ).value;
    this.stepEssFileService.haveMedicationSupply = this.householdForm.get(
      'medicationSupply'
    ).value;
    this.stepEssFileService.addMemberIndicator = this.householdForm.get(
      'addMemberIndicator'
    ).value;
  }
}
