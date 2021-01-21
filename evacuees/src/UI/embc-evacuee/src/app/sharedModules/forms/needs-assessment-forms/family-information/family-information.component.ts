import { Component, OnInit, NgModule, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
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

@Component({
  selector: 'app-family-information',
  templateUrl: './family-information.component.html',
  styleUrls: ['./family-information.component.scss']
})
export default class FamilyInformationComponent implements OnInit {

  familyMemberForm: FormGroup;
  radioOption = globalConst.radioButton1;
  formBuilder: FormBuilder;
  familyMemberForm$: Subscription;
  formCreationService: FormCreationService;
  showFamilyForm = false;
  displayedColumns: string[] = ['firstName', 'lastName', 'initials', 'gender', 'dateOfBirth', 'buttons'];
  dataSource = new BehaviorSubject([]);
  data = [];
  editIndex: number;
  rowEdit = false;
  // showTable = true;
  editFlag = false;

  constructor(
    @Inject('formBuilder') formBuilder: FormBuilder, @Inject('formCreationService') formCreationService: FormCreationService,
    public dialog: MatDialog) {
    this.formBuilder = formBuilder;
    this.formCreationService = formCreationService;
  }

  ngOnInit(): void {
    this.familyMemberForm$ = this.formCreationService.getFamilyMembersForm().subscribe(
      familyMemberForm => {
        this.familyMemberForm = familyMemberForm;
      }
    );
    this.familyMemberForm.get('addFamilyMemberIndicator').valueChanges.subscribe(value =>
      this.updateOnVisibility());
    this.dataSource.next(this.familyMemberForm.get('familyMember').value);
    this.data = this.familyMemberForm.get('familyMember').value;

  }

  addMembers(): void {
    this.familyMemberForm.get('member').reset();
    this.showFamilyForm = !this.showFamilyForm;
    // this.showTable = !this.showTable;
    this.editFlag = !this.editFlag;
    this.familyMemberForm.get('addFamilyMemberIndicator').setValue(true);
  }

  save(): void {
    if (this.familyMemberForm.get('member').status === 'VALID') {
      if (this.editIndex !== undefined && this.rowEdit) {
        this.data[this.editIndex] = this.familyMemberForm.get('member').value;
        this.rowEdit = !this.rowEdit;
        this.editIndex = undefined;
      } else {
        this.data.push(this.familyMemberForm.get('member').value);
      }
      this.dataSource.next(this.data);
      this.familyMemberForm.get('familyMember').setValue(this.data);
      this.showFamilyForm = !this.showFamilyForm;
      this.editFlag = !this.editFlag;
      // this.showTable = !this.showTable;
    } else {
      this.familyMemberForm.get('member').markAllAsTouched();
    }
  }

  cancel(): void {

    this.showFamilyForm = !this.showFamilyForm;
    this.editFlag = !this.editFlag;
    // this.showTable = !this.showTable;
    // if (this.data.length === 0) {
    this.familyMemberForm.get('addFamilyMemberIndicator').setValue(false);
    // }
  }

  /**
   * Returns the control of the form
   */
  get familyFormControl(): { [key: string]: AbstractControl; } {
    return this.familyMemberForm.controls;
  }

  deleteRow(index: number): void {
    this.dialog.open(DialogComponent, {
      data: globalConst.deleteMemberInfoBody,
      height: '220px',
      width: '500px'
    }).afterClosed().subscribe(result => {
      if (result === 'remove') {
        console.log(result);
        this.data.splice(index, 1);
        this.dataSource.next(this.data);
        this.familyMemberForm.get('familyMember').setValue(this.data);
        if (this.data.length === 0) {
          this.familyMemberForm.get('addFamilyMemberIndicator').setValue(false);
        }
      }
    });
  }

  editRow(element, index): void {
    this.editIndex = index;
    this.rowEdit = !this.rowEdit;
    this.familyMemberForm.get('member').setValue(element);
    this.showFamilyForm = !this.showFamilyForm;
    this.editFlag = !this.editFlag;
    // this.showTable = !this.showTable;
    this.familyMemberForm.get('addFamilyMemberIndicator').setValue(true);
  }

  updateOnVisibility(): void {
    this.familyMemberForm.get('member.firstName').updateValueAndValidity();
    this.familyMemberForm.get('member.lastName').updateValueAndValidity();
    this.familyMemberForm.get('member.gender').updateValueAndValidity();
    this.familyMemberForm.get('member.dateOfBirth').updateValueAndValidity();
  }

  hasSpecialDietChange(event: MatRadioChange): void {

    if (event.value === false) {
      this.familyMemberForm.get('haveSpecialDietSpecifications').reset();
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
  declarations: [
    FamilyInformationComponent,
  ]
})
class FamilyInformationModule {

}
