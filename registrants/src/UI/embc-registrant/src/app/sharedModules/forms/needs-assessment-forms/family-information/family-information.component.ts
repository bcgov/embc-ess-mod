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
  householdMembersForm: UntypedFormGroup;
  radioOption = globalConst.radioButton1;
  formBuilder: UntypedFormBuilder;
  householdMembersForm$: Subscription;
  formCreationService: FormCreationService;
  showFamilyForm = false;
  displayedColumns: string[] = ['firstName', 'lastName', 'initials', 'gender', 'dateOfBirth', 'contact', 'buttons'];
  dataSource = new BehaviorSubject([]);
  data = [];
  editIndex: number;
  rowEdit = false;
  editFlag = false;
  // householdMembersForm$: Subscription;

  constructor(
    @Inject('formBuilder') formBuilder: UntypedFormBuilder,
    @Inject('formCreationService') formCreationService: FormCreationService,
    public dialog: MatDialog
  ) {
    this.formBuilder = formBuilder;
    this.formCreationService = formCreationService;
  }

  ngOnInit(): void {
    this.householdMembersForm$ = this.formCreationService.getHouseholdMembersForm().subscribe((form) => {
      this.householdMembersForm = form;
      this.householdMembersForm.get('householdMember').disable();
    });

    this.householdMembersForm.get('addHouseholdMemberIndicator').valueChanges.subscribe((value) => {
      const form = this.householdMembersForm.get('householdMember');
      if (value) {
        form.enable();
      } else {
        form.disable();
      }
    });
    this.dataSource.next(this.householdMembersForm.get('householdMembers').value);
    this.data = this.householdMembersForm.get('householdMembers').value;
  }

  ngOnDestroy(): void {
    this.householdMembersForm$.unsubscribe();
  }

  addMembers(): void {
    this.householdMembersForm.get('householdMember').reset();
    this.showFamilyForm = !this.showFamilyForm;
    this.editFlag = false;
    this.householdMembersForm.get('addHouseholdMemberIndicator').setValue(true);
  }

  save(): void {
    if (this.householdMembersForm.get('householdMember').status === 'VALID') {
      if (this.compareToPrimaryApplicant()) {
        this.duplicateHouseholdMemberWarningDialog();
        return;
      }
      const duplicateHouseholdMemberIndex = this.data.findIndex((element) => {
        return (
          element.firstName?.toLowerCase()?.trim() ===
            this.householdMembersForm.get('householdMember').value?.firstName?.toLowerCase()?.trim() &&
          element.lastName?.toLowerCase()?.trim() ===
            this.householdMembersForm.get('householdMember').value?.lastName?.toLowerCase()?.trim() &&
          element.dateOfBirth === this.householdMembersForm.get('householdMember').value?.dateOfBirth
        );
      });
      if (this.editIndex !== undefined && this.rowEdit) {
        if (duplicateHouseholdMemberIndex !== -1 && duplicateHouseholdMemberIndex !== this.editIndex) {
          this.duplicateHouseholdMemberWarningDialog();
          return;
        } else {
          this.data[this.editIndex] = this.householdMembersForm.get('householdMember').value;
          this.rowEdit = !this.rowEdit;
          this.editIndex = undefined;
          this.clearAddForm();
        }
      } else {
        if (duplicateHouseholdMemberIndex !== -1) {
          this.duplicateHouseholdMemberWarningDialog();
          return;
        } else {
          this.data.push(this.householdMembersForm.get('householdMember').value);
          this.clearAddForm();
        }
      }
    } else {
      this.householdMembersForm.get('householdMember').markAllAsTouched();
    }
  }

  clearAddForm(): void {
    this.dataSource.next(this.data);
    this.householdMembersForm.get('householdMembers').setValue(this.data);
    this.showFamilyForm = !this.showFamilyForm;
    this.editFlag = false;
    this.scrollToTopHousehold();
  }

  cancel(): void {
    this.showFamilyForm = !this.showFamilyForm;
    this.editFlag = false;
    this.householdMembersForm.get('addHouseholdMemberIndicator').setValue(false);
    this.scrollToTopHousehold();
  }

  /**
   * Returns the control of the form
   */
  get householdFormControl(): { [key: string]: AbstractControl } {
    return this.householdMembersForm.controls;
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
          this.householdMembersForm.get('householdMembers').setValue(this.data);
          if (this.data.length === 0) {
            this.householdMembersForm.get('addHouseholdMemberIndicator').setValue(false);
          }
        }
      });
  }

  editRow(element, index): void {
    this.editIndex = index;
    this.rowEdit = !this.rowEdit;
    this.householdMembersForm.get('householdMember').setValue(element);
    this.showFamilyForm = !this.showFamilyForm;
    this.editFlag = true;
    this.householdMembersForm.get('addHouseholdMemberIndicator').setValue(true);
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
      this.householdMembersForm.value?.firstName?.toLowerCase()?.trim() ===
        this.householdMembersForm.get('householdMember').value?.firstName?.toLowerCase()?.trim() &&
      this.householdMembersForm.value?.lastName?.toLowerCase()?.trim() ===
        this.householdMembersForm.get('householdMember').value?.lastName?.toLowerCase()?.trim() &&
      this.householdMembersForm.value?.dateOfBirth?.toLowerCase()?.trim() ===
        this.householdMembersForm.get('householdMember').value?.dateOfBirth?.toLowerCase()?.trim()
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
