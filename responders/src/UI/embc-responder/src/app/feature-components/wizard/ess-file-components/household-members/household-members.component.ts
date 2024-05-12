import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatRadioChange, MatRadioGroup, MatRadioButton } from '@angular/material/radio';
import { BehaviorSubject } from 'rxjs';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import * as globalConst from '../../../../core/services/global-constants';
import { StepEssFileService } from '../../step-ess-file/step-ess-file.service';
import { Router } from '@angular/router';
import { HouseholdMembersService } from './household-members.service';
import { InformationDialogComponent } from 'src/app/shared/components/dialog-components/information-dialog/information-dialog.component';
import { HouseholdMemberModel } from 'src/app/core/models/household-member.model';
import { HouseholdMemberType } from 'src/app/core/api/models';
import { SelectionModel } from '@angular/cdk/collections';
import { WizardService } from '../../wizard.service';
import { TabModel } from 'src/app/core/models/tab.model';
import { AppBaseService } from 'src/app/core/services/helper/appBase.service';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatCheckbox } from '@angular/material/checkbox';
import {
  MatTable,
  MatColumnDef,
  MatHeaderCellDef,
  MatHeaderCell,
  MatCellDef,
  MatCell,
  MatHeaderRowDef,
  MatHeaderRow,
  MatRowDef,
  MatRow
} from '@angular/material/table';
import { PersonDetailFormComponent } from '../../../../shared/forms/person-detail-form/person-detail-form.component';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatError } from '@angular/material/form-field';
import { NgClass, UpperCasePipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-household-members',
  templateUrl: './household-members.component.html',
  styleUrls: ['./household-members.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatRadioGroup,
    MatRadioButton,
    MatError,
    MatButton,
    PersonDetailFormComponent,
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCheckbox,
    MatCellDef,
    MatCell,
    NgClass,
    MatIconButton,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    MatCard,
    MatCardContent,
    UpperCasePipe,
    DatePipe
  ]
})
export class HouseholdMembersComponent implements OnInit, OnDestroy {
  @Output() validHouseholdMemebersIndicator = new EventEmitter<boolean>();
  householdForm: UntypedFormGroup;
  memberSource = new BehaviorSubject([]);
  selection = new SelectionModel<HouseholdMemberModel>(true, []);
  members: HouseholdMemberModel[] = [];
  radioOption = globalConst.radioButtonOptions;
  essFileNumber: string;
  editIndex: number;
  editFlag = false;
  duplicateFlag = false;
  addNewMember = false;
  showMemberForm = false;
  newMembersColumns: string[] = ['members', 'buttons'];
  editMembersColumns: string[] = ['select', 'members', 'buttons'];
  membersColumns: string[] = [];
  memberTipText: string;

  constructor(
    public stepEssFileService: StepEssFileService,
    private dialog: MatDialog,
    private formBuilder: UntypedFormBuilder,
    private customValidation: CustomValidationService,
    private householdService: HouseholdMembersService,
    private wizardService: WizardService,
    private appBaseService: AppBaseService
  ) {}

  ngOnInit(): void {
    this.memberTipText = this.appBaseService?.wizardProperties?.memberTipText;
    this.essFileNumber = this.appBaseService?.appModel?.selectedEssFile?.id;
    this.addNewMember = this.stepEssFileService.addMemberIndicator;

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
      this.householdForm.get('addMemberFormIndicator').setValue(true);
      this.householdForm.get('addMemberIndicator').setValue(true);
    }

    // If the user goes back to the household members tab and left a Personal Details form incomplete, the form is displayed
    if (this.stepEssFileService.addMemberIndicator === true) {
      this.showMemberForm = true;
      this.householdForm.get('houseHoldMember').markAllAsTouched();
    }

    // Updates the status of the form according to changes
    this.householdForm.get('addMemberFormIndicator').valueChanges.subscribe(() => {
      this.updateOnVisibility();
    });

    this.runValidation();

    this.householdForm.valueChanges.subscribe(() => {
      this.runValidation();
    });
    this.selection.changed.subscribe(() => {
      this.runValidation();
    });
  }

  /**
   * Returns the control of the household member form
   */
  public get houseHoldMemberFormGroup(): UntypedFormGroup {
    return this.householdForm.get('houseHoldMember') as UntypedFormGroup;
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
    this.editFlag = false;
    this.addNewMember = true;
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
    this.addNewMember = false;
    this.editFlag = true;
  }

  /**
   * Saves householdmembers in the Evacuation File Form
   */
  save(): void {
    this.duplicateFlag = false;

    if (this.householdForm.get('houseHoldMember').status === 'VALID') {
      if (this.editIndex !== undefined && this.editFlag) {
        this.saveEditedMember();
      } else {
        this.saveNewMember();
      }
    } else {
      this.householdForm.get('houseHoldMember').markAllAsTouched();
    }
  }

  /**
   * Resets the household Member form and goes back to the main Form
   */
  cancel(): void {
    this.householdForm.get('addMemberFormIndicator').setValue(false);
    this.householdForm.get('addMemberIndicator').setValue(false);
    this.householdForm.get('houseHoldMember').reset();

    this.showMemberForm = false;
    this.editFlag = false;
    this.duplicateFlag = false;

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
      this.addNewMember = false;

      // If "no members", still keep Primary
      this.members = this.stepEssFileService.householdMembers.filter((m) => m.isPrimaryRegistrant);
      this.memberSource.next(this.members);

      this.householdForm.get('houseHoldMember').reset();
      this.householdForm.get('addMemberFormIndicator').setValue(false);
      this.householdForm.get('addMemberIndicator').setValue(false);
    } else {
      this.showMemberForm = true;
      this.householdForm.get('addMemberFormIndicator').setValue(true);
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
   * When navigating away from tab, update variable value and status indicator
   */
  ngOnDestroy(): void {
    if (this.stepEssFileService.checkForEdit()) {
      const isFormUpdated = this.wizardService.hasChanged(this.householdForm.controls, 'householdMember');

      this.wizardService.setEditStatus({
        tabName: 'householdMember',
        tabUpdateStatus: isFormUpdated || this.stepEssFileService.needsAssessmentSubmitFlag
      });
      this.stepEssFileService.updateEditedFormStatus();
    }
    //this.stepEssFileService.nextTabUpdate.next();
  }

  /**
   * Create Household Members main form
   */
  private createHouseholdForm(): void {
    if (!this.stepEssFileService.householdMembers) this.stepEssFileService.householdMembers = [];

    this.householdForm = this.formBuilder.group({
      hasHouseholdMembers: [this.stepEssFileService.haveHouseHoldMembers, Validators.required],
      houseHoldMember: this.createHouseholdMemberForm(),
      addMemberIndicator: [this.stepEssFileService.addMemberIndicator ?? false],
      addMemberFormIndicator: [this.stepEssFileService.addMemberFormIndicator ?? false]
    });
  }

  /**
   * Creates household member form to insert household members
   *
   * @returns a PersonalDetails form
   */
  private createHouseholdMemberForm(): UntypedFormGroup {
    return this.formBuilder.group({
      firstName: [
        this.stepEssFileService?.tempHouseholdMember?.firstName ?? '',
        [
          this.customValidation
            .conditionalValidation(
              () => this.householdForm.get('addMemberFormIndicator').value === true,
              this.customValidation.whitespaceValidator()
            )
            .bind(this.customValidation)
        ]
      ],
      lastName: [
        this.stepEssFileService?.tempHouseholdMember?.lastName ?? '',
        [
          this.customValidation
            .conditionalValidation(
              () => this.householdForm.get('addMemberFormIndicator').value === true,
              this.customValidation.whitespaceValidator()
            )
            .bind(this.customValidation)
        ]
      ],
      dateOfBirth: [
        this.stepEssFileService?.tempHouseholdMember?.dateOfBirth ?? '',
        [
          this.customValidation
            .conditionalValidation(
              () => this.householdForm.get('addMemberFormIndicator').value === true,
              Validators.required
            )
            .bind(this.customValidation),
          this.customValidation.dateOfBirthValidator()
        ]
      ],
      gender: [
        this.stepEssFileService?.tempHouseholdMember?.gender ?? '',
        [
          this.customValidation
            .conditionalValidation(
              () => this.householdForm.get('addMemberFormIndicator').value === true,
              Validators.required
            )
            .bind(this.customValidation)
        ]
      ],
      initials: [this.stepEssFileService?.tempHouseholdMember?.initials ?? ''],
      sameLastName: [this.stepEssFileService?.tempHouseholdMember?.sameLastName ?? ''],
      id: ['']
    });
  }

  /**
   * Updates the validations for personalDetailsForm
   */
  private updateOnVisibility(): void {
    this.householdService.updateOnVisibility(this.householdForm);
  }

  private runValidation() {
    if (!this.essFileNumber) {
      if (
        this.householdForm.valid &&
        this.householdForm.get('addMemberIndicator').value === false &&
        !(this.householdForm.get('hasHouseholdMembers').value === 'Yes' && this.members.length < 2)
      ) {
        this.validHouseholdMemebersIndicator.emit(true);
      } else if (this.stepEssFileService.checkForPartialUpdates(this.householdForm)) {
        this.validHouseholdMemebersIndicator.emit(false);
      } else {
        this.validHouseholdMemebersIndicator.emit(false);
      }
    } else if (this.essFileNumber) {
      if (
        this.householdForm.valid &&
        this.householdForm.get('addMemberIndicator').value === false &&
        this.selection.selected.length >= 1
      ) {
        this.validHouseholdMemebersIndicator.emit(true);
      } else if (this.stepEssFileService.checkForPartialUpdates(this.householdForm)) {
        this.validHouseholdMemebersIndicator.emit(false);
      } else {
        this.validHouseholdMemebersIndicator.emit(false);
      }
    }

    this.saveFormData();
  }

  /**
   * Saves information inserted inthe form into the service
   */
  private saveFormData() {
    this.stepEssFileService.haveHouseHoldMembers = this.householdForm.get('hasHouseholdMembers').value;

    this.stepEssFileService.householdMembers = this.members;
    this.stepEssFileService.selectedHouseholdMembers = this.selection.selected;

    this.stepEssFileService.addMemberFormIndicator = this.householdForm.get('addMemberFormIndicator').value;
    this.stepEssFileService.addMemberIndicator = this.householdForm.get('addMemberIndicator').value;

    this.stepEssFileService.tempHouseholdMember = this.householdForm.get('houseHoldMember').value;
  }

  private saveNewMember(): void {
    if (!this.householdService.householdMemberExists(this.householdForm.get('houseHoldMember').value, this.members)) {
      this.members.push({
        ...this.householdForm.get('houseHoldMember').value,
        isPrimaryRegistrant: false,
        householdMemberFromDatabase: false,
        type: HouseholdMemberType.HouseholdMember
      });

      this.selection.select(this.members[this.members.length - 1]);
      this.memberSource.next(this.members);
      this.householdService.saveHouseholdMember(this.householdForm);

      this.showMemberForm = false;
      this.addNewMember = false;
    } else {
      this.duplicateFlag = true;
    }
  }

  private saveEditedMember(): void {
    const similarMember = this.householdService.householdMemberExists(
      this.householdForm.get('houseHoldMember').value,
      this.members
    );

    if (similarMember === this.members[this.editIndex] || similarMember === undefined) {
      this.members[this.editIndex] = {
        ...this.members[this.editIndex],
        ...this.householdForm.get('houseHoldMember').value
      };

      this.selection.select(this.members[this.editIndex]);
      this.editIndex = undefined;

      this.memberSource.next(this.members);
      this.householdService.saveHouseholdMember(this.householdForm);

      this.showMemberForm = false;
      this.editFlag = false;
    } else {
      this.duplicateFlag = true;
    }
  }
}
