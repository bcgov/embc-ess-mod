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
import { HouseholdMemberModel } from 'src/app/core/models/household-member.model';
import { HouseholdMemberType } from 'src/app/core/api/models';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
import { SelectionModel } from '@angular/cdk/collections';
import { WizardService } from '../../wizard.service';

@Component({
  selector: 'app-household-members',
  templateUrl: './household-members.component.html',
  styleUrls: ['./household-members.component.scss']
})
export class HouseholdMembersComponent implements OnInit, OnDestroy {
  householdForm: FormGroup;
  memberSource = new BehaviorSubject([]);
  selection = new SelectionModel<HouseholdMemberModel>(true, []);
  members: HouseholdMemberModel[] = [];
  radioOption = globalConst.radioButtonOptions;
  essFileNumber: string;
  editIndex: number;
  editFlag = false;
  showMemberForm = false;
  newMembersColumns: string[] = ['members', 'buttons'];
  editMembersColumns: string[] = ['select', 'members', 'buttons'];
  membersColumns: string[] = [];
  tabUpdateSubscription: Subscription;
  wizardType: string;

  constructor(
    public stepEssFileService: StepEssFileService,
    private evacueeSessionService: EvacueeSessionService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private customValidation: CustomValidationService,
    private router: Router,
    private householdService: HouseholdMembersService,
    private wizardService: WizardService
  ) {}

  ngOnInit(): void {
    this.wizardType = this.evacueeSessionService.getWizardType();
    this.essFileNumber = this.evacueeSessionService.essFileNumber;

    // Main form creation
    this.createHouseholdForm();

    // Set up Members array
    this.members = this.stepEssFileService.householdMembers;
    this.memberSource.next(this.members);

    // Set up type of members table to display
    if (!this.essFileNumber) {
      this.membersColumns = this.newMembersColumns;
    } else {
      this.membersColumns = this.editMembersColumns;
      if (this.stepEssFileService.selectedHouseholdMembers?.length > 0) {
        for (const option of this.stepEssFileService.selectedHouseholdMembers) {
          this.selection.select(option);
        }
      }
    }

    // Displaying household member form in case 'haveHouseholdMembers' has been set to true
    if (
      this.stepEssFileService.haveHouseHoldMembers === 'Yes' &&
      this.stepEssFileService.householdMembers.length === 1
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
    this.showMemberForm = true;
    this.editFlag = true;
  }

  /**
   * Allows editing information from inserted household members
   *
   * @param member
   * @param index
   */
  editRow(member: HouseholdMemberModel, index): void {
    // Member has to be adjusted so only form fields are left
    const formMember = member;
    delete formMember.isPrimaryRegistrant;
    delete formMember.type;

    // Set up form field with member values
    this.householdService.editRow(this.householdForm, member);
    this.editIndex = index;
    this.selection.deselect(member);
    this.showMemberForm = true;
    this.editFlag = true;
  }

  /**
   * Saves householdmembers in the Evacuation File Form
   */
  save(): void {
    if (this.householdForm.get('houseHoldMember').status === 'VALID') {
      if (this.editIndex !== undefined && this.editFlag) {
        // Editing existing Member
        this.members[this.editIndex] = {
          ...this.members[this.editIndex],
          ...this.householdForm.get('houseHoldMember').value
        };

        //Adding edited household members to selected items
        this.selection.select(this.members[this.editIndex]);
        this.editIndex = undefined;
      } else {
        // Adding new Member
        this.members.push({
          ...this.householdForm.get('houseHoldMember').value,
          isPrimaryRegistrant: false,
          householdMemberFromDatabase: false,
          type: HouseholdMemberType.HouseholdMember
        });

        //Adding edited household members to selected items
        this.selection.select(this.members[this.members.length - 1]);
      }

      this.memberSource.next(this.members);
      this.householdService.saveHouseholdMember(this.householdForm);

      this.showMemberForm = false;
      this.editFlag = false;
    } else {
      this.householdForm.get('houseHoldMember').markAllAsTouched();
    }
  }

  /**
   * Resets the househol Member form and goes back to the main Form
   */
  cancel(): void {
    this.householdService.cancel(this.householdForm);
    this.showMemberForm = false;
    this.editFlag = false;

    if (this.members.length < 2) {
      this.householdForm.get('hasHouseholdMembers').setValue(false);
    }
  }

  /**
   * Deletes the selected household member from the table list
   *
   * @param index
   */
  deleteRow(member: HouseholdMemberModel, index: number): void {
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
          this.selection.deselect(member);
          this.members.splice(index, 1);
          this.memberSource.next(this.members);

          if (this.members.length < 2) {
            this.householdForm.get('hasHouseholdMembers').setValue('No');
          }
        }
      });
  }

  /**
   * Listen to changes on Have Household Members option to display the Add Member form
   *
   * @param event
   */
  hasHouseholdMembers(event: MatRadioChange): void {
    if (event.value === 'No') {
      this.showMemberForm = false;
      this.editFlag = false;

      // If "no members", still keep Primary
      this.members = this.stepEssFileService.householdMembers.filter(
        (m) => m.isPrimaryRegistrant
      );
      this.memberSource.next(this.members);

      this.householdForm.get('houseHoldMember').reset();
      this.householdForm.get('addMemberIndicator').setValue(false);
    } else {
      this.showMemberForm = true;
      this.editFlag = true;
      this.householdForm.get('addMemberIndicator').setValue(true);
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.members.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.members);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: HouseholdMemberModel): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'}`;
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
    if (this.stepEssFileService.checkForEdit()) {
      const isFormUpdated = this.wizardService.hasChanged(
        this.householdForm.controls,
        'householdMember'
      );

      // const hasMembersUpdated = this.wizardService.hasMemberChanged(
      //   this.members
      // );

      this.wizardService.setEditStatus({
        tabName: 'householdMember',
        tabUpdateStatus: isFormUpdated
      });
      this.stepEssFileService.updateEditedFormStatus();
    }
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
      houseHoldMember: this.createHouseholdMemberForm(),
      hasSpecialDiet: [
        this.stepEssFileService.haveSpecialDiet,
        Validators.required
      ],
      specialDietDetails: [
        this.stepEssFileService.specialDietDetails ?? ''
        // [
        //   this.customValidation
        //     .conditionalValidation(
        //       () => this.householdForm.get('hasSpecialDiet').value === 'Yes',
        //       this.customValidation.whitespaceValidator()
        //     )
        //     .bind(this.customValidation)
        // ]
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
              () => this.householdForm.get('hasMedication').value === 'Yes',
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
            .bind(this.customValidation),
          this.customValidation.dateOfBirthValidator()
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
      sameLastName: [''],
      id: ['']
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
    // Remove Edit form if displayed while tabbing out
    if (this.editFlag) this.cancel();

    if (!this.essFileNumber) {
      if (
        this.householdForm.valid &&
        !(
          this.householdForm.get('hasHouseholdMembers').value === 'Yes' &&
          this.members.length < 2
        )
      ) {
        this.stepEssFileService.setTabStatus('household-members', 'complete');
      } else if (
        this.stepEssFileService.checkForPartialUpdates(this.householdForm)
      ) {
        this.stepEssFileService.setTabStatus('household-members', 'incomplete');
      } else {
        this.stepEssFileService.setTabStatus(
          'household-members',
          'not-started'
        );
      }
    } else if (this.essFileNumber) {
      if (this.householdForm.valid && this.selection.selected.length >= 1) {
        this.stepEssFileService.setTabStatus('household-members', 'complete');
      } else if (
        this.stepEssFileService.checkForPartialUpdates(this.householdForm)
      ) {
        this.stepEssFileService.setTabStatus('household-members', 'incomplete');
      } else {
        this.stepEssFileService.setTabStatus(
          'household-members',
          'not-started'
        );
      }
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

    this.stepEssFileService.householdMembers = this.members;
    this.stepEssFileService.selectedHouseholdMembers = this.selection.selected;

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
