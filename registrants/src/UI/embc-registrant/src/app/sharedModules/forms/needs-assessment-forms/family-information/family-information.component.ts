import { Component, OnInit, NgModule, Inject } from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { FormCreationService } from '../../../../core/services/formCreation.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { PersonDetailFormModule } from '../../person-detail-form/person-detail-form.module';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import * as globalConst from '../../../../core/services/globalConstants';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/core/components/dialog/dialog.component';
import { InformationDialogComponent } from 'src/app/core/components/dialog-components/information-dialog/information-dialog.component';

@Component({
  selector: 'app-family-information',
  templateUrl: './family-information.component.html',
  styleUrls: ['./family-information.component.scss']
})
export default class FamilyInformationComponent implements OnInit {
  householdMemberForm: UntypedFormGroup;
  radioOption = globalConst.radioButton1;
  formBuilder: UntypedFormBuilder;
  householdMemberForm$: Subscription;
  formCreationService: FormCreationService;
  showFamilyForm = false;
  displayedColumns: string[] = [
    'firstName',
    'lastName',
    'initials',
    'gender',
    'dateOfBirth',
    'buttons'
  ];
  dataSource = new BehaviorSubject([]);
  data = [];
  editIndex: number;
  rowEdit = false;
  editFlag = false;

  constructor(
    @Inject('formBuilder') formBuilder: UntypedFormBuilder,
    @Inject('formCreationService') formCreationService: FormCreationService,
    public dialog: MatDialog
  ) {
    this.formBuilder = formBuilder;
    this.formCreationService = formCreationService;
  }

  ngOnInit(): void {
    this.householdMemberForm$ = this.formCreationService
      .getHouseholdMembersForm()
      .subscribe((householdMemberForm) => {
        this.householdMemberForm = householdMemberForm;
      });
    this.householdMemberForm
      .get('addHouseholdMemberIndicator')
      .valueChanges.subscribe((value) => this.updateOnVisibility());
    this.dataSource.next(
      this.householdMemberForm.get('householdMembers').value
    );
    this.data = this.householdMemberForm.get('householdMembers').value;
  }

  addMembers(): void {
    this.householdMemberForm.get('householdMember').reset();
    this.showFamilyForm = !this.showFamilyForm;
    this.editFlag = !this.editFlag;
    this.householdMemberForm.get('addHouseholdMemberIndicator').setValue(true);
  }

  save(): void {
    if (this.householdMemberForm.get('householdMember').status === 'VALID') {
      if (this.editIndex !== undefined && this.rowEdit) {
        this.data[this.editIndex] =
          this.householdMemberForm.get('householdMember').value;
        this.rowEdit = !this.rowEdit;
        this.editIndex = undefined;
      } else {
        this.data.push(this.householdMemberForm.get('householdMember').value);
      }
      this.dataSource.next(this.data);
      this.householdMemberForm.get('householdMembers').setValue(this.data);
      this.showFamilyForm = !this.showFamilyForm;
      this.editFlag = !this.editFlag;
    } else {
      this.householdMemberForm.get('householdMember').markAllAsTouched();
    }
  }

  cancel(): void {
    this.showFamilyForm = !this.showFamilyForm;
    this.editFlag = !this.editFlag;
    this.householdMemberForm.get('addHouseholdMemberIndicator').setValue(false);
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
        height: '260px',
        width: '500px'
      })
      .afterClosed()
      .subscribe((result) => {
        if (result === 'confirm') {
          this.data.splice(index, 1);
          this.dataSource.next(this.data);
          this.householdMemberForm.get('householdMembers').setValue(this.data);
          if (this.data.length === 0) {
            this.householdMemberForm
              .get('addHouseholdMemberIndicator')
              .setValue(false);
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
    this.householdMemberForm
      .get('householdMember.firstName')
      .updateValueAndValidity();
    this.householdMemberForm
      .get('householdMember.lastName')
      .updateValueAndValidity();
    this.householdMemberForm
      .get('householdMember.gender')
      .updateValueAndValidity();
    this.householdMemberForm
      .get('householdMember.dateOfBirth')
      .updateValueAndValidity();
  }

  hasSpecialDietChange(event: MatRadioChange): void {
    if (event.value === false) {
      this.householdMemberForm.get('specialDietDetails').reset();
    }
  }
}

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatRadioModule,
    PersonDetailFormModule,
    MatTableModule,
    MatIconModule
  ],
  declarations: [FamilyInformationComponent]
})
class FamilyInformationModule {}
