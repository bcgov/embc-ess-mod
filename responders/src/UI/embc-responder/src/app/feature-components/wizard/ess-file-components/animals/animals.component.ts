import { Component, OnInit } from '@angular/core';
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
  tabUpdateSubscription: Subscription;

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

    // Set "update tab status" method, called for any tab navigation
    this.tabUpdateSubscription = this.stepCreateEssFileService.nextTabUpdate.subscribe(
      () => {
        this.updateTabStatus();
      }
    );

    // Update Value and Validity for pets form if hasPets changes 
    this.animalsForm
      .get('hasPets')
      .valueChanges.subscribe(() => {
        this.animalsForm
          .get('hasPetsFood')
          .updateValueAndValidity();

          this.animalsForm
          .get('pets')
          .updateValueAndValidity();

          this.petFormGroup.updateValueAndValidity();
      });

    if(this.stepCreateEssFileService.hasPetS === true && this.stepCreateEssFileService.petS.length === 0) {
      this.showPetsForm = true;
    }
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
      this.animalsForm.get('hasPetsFood').reset();
      this.animalsForm.get('petCareDetails').reset();
    }
  }

  editRow(element, index): void {
    this.editIndex = index;
    this.rowEdit = !this.rowEdit;
    this.animalsForm.get('pet').setValue(element);
    this.showPetsForm = !this.showPetsForm;
  }

  back() {
    this.router.navigate(['/ess-wizard/create-ess-file/household-members']);
  }

  /**
   * Updates the tab status and navigate to next tab
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
      type: ['', [this.customValidation
        .conditionalValidation(
          () => this.animalsForm.get('hasPets').value === true,
          this.customValidation.whitespaceValidator()
        )
        .bind(this.customValidation)]],
      quantity: [
        '',
        [this.customValidation
          .conditionalValidation(
            () => this.animalsForm.get('hasPets').value === true,
            this.customValidation.quantityPetsValidator() && Validators.required
          )
          .bind(this.customValidation)
          ]
      ]
    });
  }

  /**
   * Updates the Tab Status from Incomplete, Complete or in Progress
   */
   private updateTabStatus() {
    if (this.animalsForm.valid) {
      this.stepCreateEssFileService.setTabStatus(
        'animals',
        'complete'
      );
    } else if (
      this.stepCreateEssFileService.checkForPartialUpdates(this.animalsForm)
    ) {
      this.stepCreateEssFileService.setTabStatus(
        'animals',
        'incomplete'
      );
    } else {
      this.stepCreateEssFileService.setTabStatus(
        'animals',
        'not-started'
      );
    }
    this.saveFormData();
  }

  /**
   * Saves information inserted inthe form into the service
   */
  private saveFormData() {
    this.stepCreateEssFileService.hasPetS = this.animalsForm.get(
      'hasPets'
    ).value;
    this.stepCreateEssFileService.petS = this.animalsForm.get(
      'pets'
    ).value;
    this.stepCreateEssFileService.hasPetsFooD = this.animalsForm.get(
      'hasPetsFood'
    ).value;
    this.stepCreateEssFileService.petCareDetailS = this.animalsForm.get(
      'petCareDetails'
    ).value;

    this.stepCreateEssFileService.createNeedsAssessmentDTO();
  }
}
