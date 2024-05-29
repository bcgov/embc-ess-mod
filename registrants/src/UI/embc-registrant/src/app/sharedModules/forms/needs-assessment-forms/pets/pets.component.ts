import { NgClass } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { BehaviorSubject, Subscription } from 'rxjs';
import { InformationDialogComponent } from '../../../../core/components/dialog-components/information-dialog/information-dialog.component';
import { DialogComponent } from '../../../../core/components/dialog/dialog.component';
import { FormCreationService } from '../../../../core/services/formCreation.service';
import * as globalConst from '../../../../core/services/globalConstants';
import { PetFormComponent } from '../../pet-form/pet-form.component';

@Component({
  selector: 'app-pets',
  templateUrl: './pets.component.html',
  styleUrls: ['./pets.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, MatCardModule, MatTableModule, NgClass, MatButtonModule, PetFormComponent]
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

  constructor(
    @Inject('formBuilder') formBuilder: UntypedFormBuilder,
    @Inject('formCreationService') formCreationService: FormCreationService,
    public dialog: MatDialog
  ) {
    this.formBuilder = formBuilder;
    this.formCreationService = formCreationService;
  }

  ngOnInit(): void {
    this.petsForm$ = this.formCreationService.getPetsForm().subscribe((petsForm) => {
      this.petsForm = petsForm;
    });

    this.petsForm.get('addPetIndicator').valueChanges.subscribe((value) => this.updateOnVisibility());

    this.dataSource.next(this.petsForm.get('pets').value);
    this.data = this.petsForm.get('pets').value;
  }

  addPets(): void {
    this.petsForm.get('pet').reset();
    this.showPetsForm = !this.showPetsForm;
    this.petsForm.get('addPetIndicator').setValue(true);
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
    } else {
      this.petsForm.get('pet').markAllAsTouched();
    }
  }

  cancel(): void {
    this.showPetsForm = !this.showPetsForm;

    this.petsForm.get('pet').reset();
    this.petsForm.get('addPetIndicator').setValue(false);
  }

  /**
   * Returns the control of the form
   */
  get petsFormControl(): { [key: string]: AbstractControl } {
    return this.petsForm.controls;
  }

  deleteRow(index: number): void {
    this.dialog
      .open(DialogComponent, {
        data: {
          component: InformationDialogComponent,
          content: globalConst.deletePetInfoBody
        },
        width: '575px'
      })
      .afterClosed()
      .subscribe((result) => {
        this.data.splice(index, 1);
        this.dataSource.next(this.data);
        this.petsForm.get('pets').setValue(this.data);

        if (this.data.length === 0) {
          this.petsForm.get('addPetIndicator').setValue(false);
        }
      });
  }

  editRow(element, index): void {
    this.editIndex = index;
    this.rowEdit = !this.rowEdit;
    this.petsForm.get('pet').setValue(element);
    this.showPetsForm = !this.showPetsForm;
    this.petsForm.get('addPetIndicator').setValue(true);
  }

  updateOnVisibility(): void {
    this.petsForm.get('pet.type').updateValueAndValidity();
    this.petsForm.get('pet.quantity').updateValueAndValidity();
  }
}
