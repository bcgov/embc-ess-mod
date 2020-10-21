import { Component, OnInit, NgModule, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { FormCreationService } from '../../../services/formCreation.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { PersonDetailFormModule } from '../../person-detail-form/person-detail-form.module';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-family-information',
  templateUrl: './family-information.component.html',
  styleUrls: ['./family-information.component.scss']
})
export default class FamilyInformationComponent implements OnInit {

  familyMemberForm: FormGroup;
  radioOption: string[] = ['Yes', 'No'];
  formBuilder: FormBuilder;
  familyMemberForm$: Subscription;
  formCreationService: FormCreationService;
  showFamilyForm = false;
  displayedColumns: string[] = ['firstName', 'lastName', 'initials', 'gender', 'dateOfBirth', 'buttons'];
  dataSource = new BehaviorSubject([]);
  data = [];
  editIndex: number;
  rowEdit = false;
  showTable = true;

  constructor(@Inject('formBuilder') formBuilder: FormBuilder, @Inject('formCreationService') formCreationService: FormCreationService,
  ) {
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
  }

  addMembers(): void {
    this.familyMemberForm.get('member').reset();
    this.showFamilyForm = !this.showFamilyForm;
    this.showTable = !this.showTable;
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
      this.showFamilyForm = !this.showFamilyForm;
      this.showTable = !this.showTable;
    } else {
      this.familyMemberForm.get('member').markAllAsTouched();
    }
  }

  cancel(): void {
    this.showFamilyForm = !this.showFamilyForm;
    this.showTable = !this.showTable;
    if (this.data.length === 0) {
      this.familyMemberForm.get('addFamilyMemberIndicator').setValue(false);
    }
  }

  /**
   * Returns the control of the form
   */
  get familyFormControl(): { [key: string]: AbstractControl; } {
    return this.familyMemberForm.controls;
  }

  deleteRow(index: number): void {
    this.data.splice(index, 1);
    this.dataSource.next(this.data);
    if (this.data.length === 0) {
      this.familyMemberForm.get('addFamilyMemberIndicator').setValue(false);
    }
  }

  editRow(element, index): void {
    this.editIndex = index;
    this.rowEdit = !this.rowEdit;
    this.familyMemberForm.get('member').setValue(element);
    this.showFamilyForm = !this.showFamilyForm;
    this.showTable = !this.showTable;
  }

  updateOnVisibility(): void {
    this.familyMemberForm.get('member.firstName').updateValueAndValidity();
    this.familyMemberForm.get('member.lastName').updateValueAndValidity();
    this.familyMemberForm.get('member.gender').updateValueAndValidity();
    this.familyMemberForm.get('member.dateOfBirth').updateValueAndValidity();
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
    MatIconModule,
  ],
  declarations: [
    FamilyInformationComponent,
  ]
})
class FamilyInformationModule {

}
