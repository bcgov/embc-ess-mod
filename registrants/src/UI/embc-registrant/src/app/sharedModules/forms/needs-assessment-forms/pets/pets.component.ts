import { Component, OnInit, NgModule, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { FormCreationService } from '../../../../core/services/formCreation.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { PetFormModule } from '../../pet-form/pet-form.module';
import * as globalConst from '../../../../core/services/globalConstants';

@Component({
  selector: 'app-pets',
  templateUrl: './pets.component.html',
  styleUrls: ['./pets.component.scss']
})
export default class PetsComponent implements OnInit {
  petsForm: UntypedFormGroup;
  radioOption = globalConst.radioButton1;
  formBuilder: UntypedFormBuilder;
  petsForm$: Subscription;
  formCreationService: FormCreationService;
  showPetsForm = false;
  displayedColumns: string[] = ['type', 'quantity', 'buttons'];
  dataSource = new BehaviorSubject([]);
  data = [];
  editIndex: number;
  rowEdit = false;
  showTable = true;

  constructor(
    @Inject('formBuilder') formBuilder: UntypedFormBuilder,
    @Inject('formCreationService') formCreationService: FormCreationService
  ) {
    this.formBuilder = formBuilder;
    this.formCreationService = formCreationService;
  }

  ngOnInit(): void {
    this.petsForm$ = this.formCreationService
      .getPetsForm()
      .subscribe((petsForm) => {
        this.petsForm = petsForm;
      });

    this.petsForm
      .get('addPetIndicator')
      .valueChanges.subscribe((value) => this.updateOnVisibility());
    this.petsForm
      .get('addPetFoodIndicator')
      .valueChanges.subscribe((value) => this.updateOnVisibility());

    this.dataSource.next(this.petsForm.get('pets').value);
    this.data = this.petsForm.get('pets').value;
  }

  addPets(): void {
    this.petsForm.get('pet').reset();
    this.showPetsForm = !this.showPetsForm;
    // this.showTable = !this.showTable;
    this.petsForm.get('addPetIndicator').setValue(true);
    this.petsForm.get('addPetFoodIndicator').setValue(true);
  }

  save(): void {
    if (this.petsForm.get('pet').status === 'VALID') {
      if (this.editIndex !== undefined && this.rowEdit) {
        this.data[this.editIndex] = this.petsForm.get('pet').value;
        this.rowEdit = !this.rowEdit;
        this.editIndex = undefined;
      } else {
        this.data.push(this.petsForm.get('pet').value);
      }
      this.dataSource.next(this.data);
      this.petsForm.get('pets').setValue(this.data);
      this.showPetsForm = !this.showPetsForm;
      // this.showTable = !this.showTable;
    } else {
      this.petsForm.get('pet').markAllAsTouched();
    }
  }

  cancel(): void {
    this.showPetsForm = !this.showPetsForm;
    // this.showTable = !this.showTable;

    this.petsForm.get('pet').reset();
    this.petsForm.get('addPetIndicator').setValue(false);

    if (this.data.length === 0) {
      this.petsForm.get('addPetFoodIndicator').setValue(false);
    }
  }

  /**
   * Returns the control of the form
   */
  get petsFormControl(): { [key: string]: AbstractControl } {
    return this.petsForm.controls;
  }

  deleteRow(index: number): void {
    this.data.splice(index, 1);
    this.dataSource.next(this.data);
    this.petsForm.get('pets').setValue(this.data);

    if (this.data.length === 0) {
      this.petsForm.get('addPetIndicator').setValue(false);
      this.petsForm.get('addPetFoodIndicator').setValue(false);
      this.petsForm.get('hasPetsFood').reset();
    }
  }

  editRow(element, index): void {
    this.editIndex = index;
    this.rowEdit = !this.rowEdit;
    this.petsForm.get('pet').setValue(element);
    this.showPetsForm = !this.showPetsForm;
    // this.showTable = !this.showTable;
    this.petsForm.get('addPetIndicator').setValue(true);
  }

  updateOnVisibility(): void {
    this.petsForm.get('pet.type').updateValueAndValidity();
    this.petsForm.get('pet.quantity').updateValueAndValidity();
    this.petsForm.get('hasPetsFood').updateValueAndValidity();
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
    MatTableModule,
    MatIconModule,
    PetFormModule
  ],
  declarations: [PetsComponent]
})
class PetsModule {}
