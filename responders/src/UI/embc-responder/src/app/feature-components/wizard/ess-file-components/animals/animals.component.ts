import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { StepCreateEssFileService } from '../../step-create-ess-file/step-create-ess-file.service';
import * as globalConst from '../../../../core/services/global-constants';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';
import { MatRadioChange } from '@angular/material/radio';

@Component({
  selector: 'app-animals',
  templateUrl: './animals.component.html',
  styleUrls: ['./animals.component.scss']
})
export class AnimalsComponent implements OnInit, OnDestroy {
  animalsForm: FormGroup;
  radioOption = globalConst.radioButtonOptions1;
  showPetsForm = false;
  displayedColumns: string[] = ['type', 'quantity', 'buttons'];
  dataSource = new BehaviorSubject([]);
  data = [];
  editIndex: number;
  rowEdit = false;
  showTable = true;
  tabUpdateSubscription: Subscription;

  constructor(
    private router: Router,
    private stepCreateEssFileService: StepCreateEssFileService,
    private customValidation: CustomValidationService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    // Creates the Animals form
    this.createAnimalsForm();

    // Adds pets list in case the user has previously inserted data
    this.dataSource.next(this.animalsForm.get('pets').value);
    this.data = this.animalsForm.get('pets').value;

    // Set "update tab status" method, called for any tab navigation
    this.tabUpdateSubscription = this.stepCreateEssFileService.nextTabUpdate.subscribe(
      () => {
        this.updateTabStatus();
      }
    );

    // Update Value and Validity for pets form if hasPets changes
    this.animalsForm.get('hasPets').valueChanges.subscribe(() => {
      this.animalsForm.get('hasPetsFood').updateValueAndValidity();

      this.animalsForm.get('pets').updateValueAndValidity();
    });

    // Updates the validations for the PetFormGroup
    this.animalsForm
      .get('addPetIndicator')
      .valueChanges.subscribe(() => this.updateOnVisibility());

    // Shows the petsGroupForm if hasPets is true and none pets has been inserted yet
    if (
      this.stepCreateEssFileService.havePets === true &&
      this.stepCreateEssFileService.petsList.length === 0
    ) {
      this.showPetsForm = true;
    }
  }

  //
  hasPetsChange(event: MatRadioChange): void {
    if (event.value === false) {
      this.showPetsForm = false;
      this.animalsForm.get('pet').reset();
    } else {
      this.showPetsForm = true;
    }
  }

  addPets(): void {
    this.animalsForm.get('pet').reset();
    this.showPetsForm = !this.showPetsForm;
    this.animalsForm.get('addPetIndicator').setValue(true);
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
      this.animalsForm.get('addPetIndicator').setValue(false);
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
    this.animalsForm.get('addPetIndicator').setValue(false);

    if (this.data.length === 0) {
      this.animalsForm.get('hasPets').setValue(false);
    }
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
    this.animalsForm.get('addPetIndicator').setValue(false);

    if (this.data.length === 0) {
      this.animalsForm.get('hasPetsFood').reset();
      this.animalsForm.get('petCareDetails').reset();
      this.animalsForm.get('hasPets').setValue(false);
    }
  }

  /**
   * Edits the selected pet from the petList
   *
   * @param element
   * @param index
   */
  editRow(element, index): void {
    this.editIndex = index;
    this.rowEdit = !this.rowEdit;
    this.animalsForm.get('pet').setValue(element);
    this.showPetsForm = !this.showPetsForm;
    this.animalsForm.get('addPetIndicator').setValue(true);
  }

  /**
   * Goes back to the previous ESS File Tab
   */
  back() {
    this.router.navigate(['/ess-wizard/create-ess-file/household-members']);
  }

  /**
   * Goes to the next tab from the ESS File
   */
  next(): void {
    this.router.navigate(['/ess-wizard/create-ess-file/needs']);
  }

  /**
   * When navigating away from tab, update variable value and status indicator
   */
  ngOnDestroy(): void {
    console.log(this.animalsForm);
    this.stepCreateEssFileService.nextTabUpdate.next();
    this.tabUpdateSubscription.unsubscribe();
  }

  /**
   * Generates the main Animals form
   */
  private createAnimalsForm(): void {
    if (!this.stepCreateEssFileService.petsList) {
      this.stepCreateEssFileService.petsList = [];
    }

    this.animalsForm = this.formBuilder.group({
      hasPets: [
        this.stepCreateEssFileService.havePets ?? '',
        [Validators.required]
      ],
      pets: [
        this.stepCreateEssFileService.petsList,
        this.customValidation
          .conditionalValidation(
            () => this.animalsForm.get('hasPets').value === true,
            Validators.required
          )
          .bind(this.customValidation)
      ],
      hasPetsFood: [
        this.stepCreateEssFileService.havePetsFood ?? '',
        this.customValidation
          .conditionalValidation(
            () => this.animalsForm.get('hasPets').value === true,
            Validators.required
          )
          .bind(this.customValidation)
      ],
      petCareDetails: [this.stepCreateEssFileService.petCareDetails ?? ''],
      pet: this.createPetForm(),
      addPetIndicator: [false]
    });
  }

  /**
   * Generates a pet form to add them in the petList
   *
   * @returns a pet form
   */
  private createPetForm(): FormGroup {
    return this.formBuilder.group({
      type: [
        '',
        [
          this.customValidation
            .conditionalValidation(
              () => this.animalsForm.get('addPetIndicator').value === true,
              this.customValidation.whitespaceValidator()
            )
            .bind(this.customValidation)
        ]
      ],
      quantity: [
        '',
        [
          this.customValidation
            .conditionalValidation(
              () => this.animalsForm.get('addPetIndicator').value === true,
              this.customValidation.quantityPetsValidator()
            )
            .bind(this.customValidation),
          this.customValidation
            .conditionalValidation(
              () => this.animalsForm.get('addPetIndicator').value === true,
              Validators.required
            )
            .bind(this.customValidation)
        ]
      ]
    });
  }

  /**
   * Updates the validations for personalDetailsForm
   */
  private updateOnVisibility(): void {
    this.animalsForm.get('pet.type').updateValueAndValidity();
    this.animalsForm.get('pet.quantity').updateValueAndValidity();
  }

  /**
   * Updates the Tab Status from Incomplete, Complete or in Progress
   */
  private updateTabStatus() {
    if (this.animalsForm.valid) {
      this.stepCreateEssFileService.setTabStatus('animals', 'complete');
    } else if (
      this.stepCreateEssFileService.checkForPartialUpdates(this.animalsForm)
    ) {
      this.stepCreateEssFileService.setTabStatus('animals', 'incomplete');
    } else {
      this.stepCreateEssFileService.setTabStatus('animals', 'not-started');
    }
    this.saveFormData();
  }

  /**
   * Saves information inserted inthe form into the service
   */
  private saveFormData() {
    this.stepCreateEssFileService.havePets = this.animalsForm.get(
      'hasPets'
    ).value;
    this.stepCreateEssFileService.petsList = this.animalsForm.get('pets').value;
    this.stepCreateEssFileService.havePetsFood = this.animalsForm.get(
      'hasPetsFood'
    ).value;
    this.stepCreateEssFileService.petCareDetails = this.animalsForm.get(
      'petCareDetails'
    ).value;
    this.stepCreateEssFileService.petCareDetails = this.animalsForm.get(
      'addPetIndicator'
    ).value;
  }
}
