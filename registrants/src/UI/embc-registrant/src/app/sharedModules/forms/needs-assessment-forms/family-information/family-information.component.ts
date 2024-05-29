import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { BehaviorSubject, Subscription } from 'rxjs';
import { InformationDialogComponent } from 'src/app/core/components/dialog-components/information-dialog/information-dialog.component';
import { DialogComponent } from 'src/app/core/components/dialog/dialog.component';
import { DialogContent } from 'src/app/core/model/dialog-content.model';
import { FormCreationService } from '../../../../core/services/formCreation.service';
import * as globalConst from '../../../../core/services/globalConstants';
import { PersonDetailFormComponent } from '../../person-detail-form/person-detail-form.component';

@Component({
  selector: 'app-family-information',
  templateUrl: './family-information.component.html',
  styleUrls: ['./family-information.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, MatCardModule, MatTableModule, MatButtonModule, PersonDetailFormComponent]
})
export default class FamilyInformationComponent implements OnInit, OnDestroy {
  householdMemberForm: UntypedFormGroup;
  radioOption = globalConst.radioButton1;
  formBuilder: UntypedFormBuilder;
  householdMemberForm$: Subscription;
  formCreationService: FormCreationService;
  showFamilyForm = false;
  displayedColumns: string[] = ['firstName', 'lastName', 'initials', 'gender', 'dateOfBirth', 'buttons'];
  dataSource = new BehaviorSubject([]);
  data = [];
  editIndex: number;
  rowEdit = false;
  editFlag = false;
  personalDetailsForm$: Subscription;
  personalDetailsForm: UntypedFormGroup;

  constructor(
    @Inject('formBuilder') formBuilder: UntypedFormBuilder,
    @Inject('formCreationService') formCreationService: FormCreationService,
    public dialog: MatDialog
  ) {
    this.formBuilder = formBuilder;
    this.formCreationService = formCreationService;
  }

  ngOnInit(): void {
    this.householdMemberForm$ = this.formCreationService.getHouseholdMembersForm().subscribe((householdMemberForm) => {
      this.householdMemberForm = householdMemberForm;
    });
    this.householdMemberForm
      .get('addHouseholdMemberIndicator')
      .valueChanges.subscribe((value) => this.updateOnVisibility());
    this.dataSource.next(this.householdMemberForm.get('householdMembers').value);
    this.data = this.householdMemberForm.get('householdMembers').value;
    this.personalDetailsForm$ = this.formCreationService.getPersonalDetailsForm().subscribe((personalDetails) => {
      this.personalDetailsForm = personalDetails;
    });
  }

  ngOnDestroy(): void {
    this.personalDetailsForm$.unsubscribe();
  }

  addMembers(): void {
    this.householdMemberForm.get('householdMember').reset();
    this.showFamilyForm = !this.showFamilyForm;
    this.editFlag = !this.editFlag;
    this.householdMemberForm.get('addHouseholdMemberIndicator').setValue(true);
  }

  save(): void {
    if (this.householdMemberForm.get('householdMember').status === 'VALID') {
      if (this.compareToPrimaryApplicant()) {
        this.duplicateHouseholdMemberWarningDialog();
        return;
      }
      const duplicateHouseholdMemberIndex = this.data.findIndex((element) => {
        return (
          element.firstName?.toLowerCase()?.trim() ===
            this.householdMemberForm.get('householdMember').value?.firstName?.toLowerCase()?.trim() &&
          element.lastName?.toLowerCase()?.trim() ===
            this.householdMemberForm.get('householdMember').value?.lastName?.toLowerCase()?.trim() &&
          element.dateOfBirth === this.householdMemberForm.get('householdMember').value?.dateOfBirth
        );
      });
      if (this.editIndex !== undefined && this.rowEdit) {
        if (duplicateHouseholdMemberIndex !== -1 && duplicateHouseholdMemberIndex !== this.editIndex) {
          this.duplicateHouseholdMemberWarningDialog();
          return;
        } else {
          this.data[this.editIndex] = this.householdMemberForm.get('householdMember').value;
          this.rowEdit = !this.rowEdit;
          this.editIndex = undefined;
          this.clearAddForm();
        }
      } else {
        if (duplicateHouseholdMemberIndex !== -1) {
          this.duplicateHouseholdMemberWarningDialog();
          return;
        } else {
          this.data.push(this.householdMemberForm.get('householdMember').value);
          this.clearAddForm();
        }
      }
    } else {
      this.householdMemberForm.get('householdMember').markAllAsTouched();
    }
  }

  clearAddForm(): void {
    this.dataSource.next(this.data);
    this.householdMemberForm.get('householdMembers').setValue(this.data);
    this.showFamilyForm = !this.showFamilyForm;
    this.editFlag = !this.editFlag;
    this.scrollToTopHousehold();
  }

  cancel(): void {
    this.showFamilyForm = !this.showFamilyForm;
    this.editFlag = !this.editFlag;
    this.householdMemberForm.get('addHouseholdMemberIndicator').setValue(false);
    this.scrollToTopHousehold();
  }

  /**
   * Returns the control of the form
   */
  get householdFormControl(): { [key: string]: AbstractControl } {
    return this.householdMemberForm.controls;
  }

  deleteRow(index: number): void {
    this.dialog
      .open(DialogComponent, {
        data: {
          component: InformationDialogComponent,
          content: globalConst.deleteMemberInfoBody
        },
        width: '575px'
      })
      .afterClosed()
      .subscribe((result) => {
        if (result === 'confirm') {
          this.data.splice(index, 1);
          this.dataSource.next(this.data);
          this.householdMemberForm.get('householdMembers').setValue(this.data);
          if (this.data.length === 0) {
            this.householdMemberForm.get('addHouseholdMemberIndicator').setValue(false);
          }
        }
      });
  }

  editRow(element, index): void {
    this.editIndex = index;
    this.rowEdit = !this.rowEdit;
    this.householdMemberForm.get('householdMember').setValue(element);
    this.showFamilyForm = !this.showFamilyForm;
    this.editFlag = !this.editFlag;
    this.householdMemberForm.get('addHouseholdMemberIndicator').setValue(true);
    this.householdMemberForm.get('addHouseholdMemberIndicator').setValue(true);
  }

  updateOnVisibility(): void {
    this.householdMemberForm.get('householdMember.firstName').updateValueAndValidity();
    this.householdMemberForm.get('householdMember.lastName').updateValueAndValidity();
    this.householdMemberForm.get('householdMember.gender').updateValueAndValidity();
    this.householdMemberForm.get('householdMember.dateOfBirth').updateValueAndValidity();
  }

  public duplicateHouseholdMemberWarningDialog() {
    this.openInfoDialog(globalConst.duplicateHouseholdMemberWarning);
  }

  private openInfoDialog(dialog: DialogContent) {
    return this.dialog.open(DialogComponent, {
      data: {
        component: InformationDialogComponent,
        content: dialog
      },
      maxWidth: '600px'
    });
  }

  private compareToPrimaryApplicant(): boolean {
    return (
      this.personalDetailsForm.value?.firstName?.toLowerCase()?.trim() ===
        this.householdMemberForm.get('householdMember').value?.firstName?.toLowerCase()?.trim() &&
      this.personalDetailsForm.value?.lastName?.toLowerCase()?.trim() ===
        this.householdMemberForm.get('householdMember').value?.lastName?.toLowerCase()?.trim() &&
      this.personalDetailsForm.value?.dateOfBirth?.toLowerCase()?.trim() ===
        this.householdMemberForm.get('householdMember').value?.dateOfBirth?.toLowerCase()?.trim()
    );
  }

  public scrollToTopHousehold() {
    // Scroll to top of householdMemberForm
    const element = document.getElementById('warningMember');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
