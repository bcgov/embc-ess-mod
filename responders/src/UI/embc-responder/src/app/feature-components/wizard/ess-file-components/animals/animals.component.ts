import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { StepCreateEssFileService } from '../../step-create-ess-file/step-create-ess-file.service';
import * as globalConst from '../../../../core/services/global-constants';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';
import { MatRadioChange } from '@angular/material/radio';

@Component({
  selector: 'app-animals',
  templateUrl: './animals.component.html',
  styleUrls: ['./animals.component.scss']
})
export class AnimalsComponent implements OnInit {
  animalsForm: FormGroup;
  radioOption = globalConst.radioButtonOptions1;
  showPetsForm = false;
  displayedColumns: string[] = ['type', 'quantity', 'buttons'];
  dataSource = new BehaviorSubject([]);
  data = [];
  editIndex: number;
  rowEdit = false;
  showTable = true;

  constructor(
    private router: Router,
    private stepCreateEssFileService: StepCreateEssFileService,
    private customValidation: CustomValidationService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.createAnimalsForm();

    this.dataSource.next(this.animalsForm.get('pets').value);
    this.data = this.animalsForm.get('pets').value;
  }

  hasPetsChange(event: MatRadioChange): void {
    if (event.value === false) {
      this.showPetsForm = false;
      this.animalsForm.get('pet').reset();
      // this.editFlag = !this.editFlag;
    } else {
      this.showPetsForm = true;
      // this.editFlag = !this.editFlag;
    }
  }

  addPets(): void {
    this.animalsForm.get('pet').reset();
    this.showPetsForm = !this.showPetsForm;
  }

  save(): void {
    if (this.animalsForm.get('pet').status === 'VALID') {
      if (this.editIndex !== undefined && this.rowEdit) {
        this.data[this.editIndex] = this.animalsForm.get('pet').value;
        this.rowEdit = !this.rowEdit;
        this.editIndex = undefined;
      } else {
        this.data.push(this.animalsForm.get('pet').value);
      }
      this.dataSource.next(this.data);
      this.animalsForm.get('pets').setValue(this.data);
      this.showPetsForm = !this.showPetsForm;
    } else {
      this.animalsForm.get('pet').markAllAsTouched();
    }
  }

  cancel(): void {
    this.showPetsForm = !this.showPetsForm;

    this.animalsForm.get('pet').reset();
  }

  /**
   * Returns the control of the form
   */
  get animalsFormControl(): { [key: string]: AbstractControl } {
    return this.animalsForm.controls;
  }

  /**
   * Returns the control of the form
   */
  public get petFormGroup(): FormGroup {
    return this.animalsForm.get('pet') as FormGroup;
  }

  deleteRow(index: number): void {
    this.data.splice(index, 1);
    this.dataSource.next(this.data);
    this.animalsForm.get('pets').setValue(this.data);

    if (this.data.length === 0) {
      this.animalsForm.get('addPetIndicator').setValue(false);
      this.animalsForm.get('addPetFoodIndicator').setValue(false);
      this.animalsForm.get('hasPetsFood').reset();
    }
  }

  editRow(element, index): void {
    this.editIndex = index;
    this.rowEdit = !this.rowEdit;
    this.animalsForm.get('pet').setValue(element);
    this.showPetsForm = !this.showPetsForm;
    // this.showTable = !this.showTable;
    this.animalsForm.get('addPetIndicator').setValue(true);
  }

  updateOnVisibility(): void {
    this.animalsForm.get('pet.type').updateValueAndValidity();
    this.animalsForm.get('pet.quantity').updateValueAndValidity();
    this.animalsForm.get('hasPetsFood').updateValueAndValidity();
  }

  back() {
    this.router.navigate(['/ess-wizard/create-ess-file/animals']);
  }

  /**
   * Updates the tab status and navigate to next tab
   */
  next(): void {
    this.stepCreateEssFileService.setTabStatus('animals', 'complete');
    this.router.navigate(['/ess-wizard/create-ess-file/review']);
  }

  private createAnimalsForm(): void {
    if (!this.stepCreateEssFileService.petS) {
      this.stepCreateEssFileService.petS = [];
    }

    this.animalsForm = this.formBuilder.group({
      hasPets: [
        this.stepCreateEssFileService.hasPetS ?? '',
        [Validators.required]
      ],
      pets: [
        this.stepCreateEssFileService.petS,
        this.customValidation
          .conditionalValidation(
            () => this.animalsForm.get('hasPets').value === true,
            Validators.required
          )
          .bind(this.customValidation)
      ],

      hasPetsFood: [
        this.stepCreateEssFileService.hasPetsFooD ?? '',
        this.customValidation
          .conditionalValidation(
            () => this.animalsForm.get('hasPets').value === true,
            Validators.required
          )
          .bind(this.customValidation)
      ],

      petCareDetails: [this.stepCreateEssFileService.petCareDetailS ?? ''],

      pet: this.createPetForm()
    });
  }

  private createPetForm(): FormGroup {
    return this.formBuilder.group({
      type: ['', [this.customValidation.whitespaceValidator()]],
      quantity: [
        '',
        [this.customValidation.quantityPetsValidator(), Validators.required]
      ]
    });
  }
}
