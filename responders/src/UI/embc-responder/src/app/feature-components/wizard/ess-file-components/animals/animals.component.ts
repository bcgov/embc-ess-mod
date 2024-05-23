import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { StepEssFileService } from '../../step-ess-file/step-ess-file.service';
import * as globalConst from '../../../../core/services/global-constants';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';
import { MatRadioChange, MatRadioGroup, MatRadioButton } from '@angular/material/radio';
import { InformationDialogComponent } from 'src/app/shared/components/dialog-components/information-dialog/information-dialog.component';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Pet } from 'src/app/core/api/models';
import { WizardService } from '../../wizard.service';
import { PetFormComponent } from '../../../../shared/forms/pet-form/pet-form.component';
import {
  MatTable,
  MatColumnDef,
  MatHeaderCellDef,
  MatHeaderCell,
  MatCellDef,
  MatCell,
  MatHeaderRowDef,
  MatHeaderRow,
  MatRowDef,
  MatRow
} from '@angular/material/table';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatError } from '@angular/material/form-field';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-animals',
  templateUrl: './animals.component.html',
  styleUrls: ['./animals.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatRadioGroup,
    MatRadioButton,
    MatError,
    MatButton,
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    NgClass,
    MatIconButton,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    PetFormComponent
  ]
})
export class AnimalsComponent implements OnInit, OnDestroy {
  @Output() validPetsIndicator: any = new EventEmitter();
  animalsForm: UntypedFormGroup;
  radioOption = globalConst.radioButtonOptions;
  showPetsForm = false;
  displayedColumns: string[] = ['type', 'quantity', 'buttons'];
  petSource = new BehaviorSubject([]);
  pets: Pet[] = [];
  editIndex: number;
  rowEdit = false;
  showTable = true;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private stepEssFileService: StepEssFileService,
    private customValidation: CustomValidationService,
    private formBuilder: UntypedFormBuilder,
    private wizardService: WizardService
  ) {}

  ngOnInit(): void {
    // Creates the Animals form
    this.createAnimalsForm();

    // Adds pets list in case the user has previously inserted data
    this.petSource.next(this.animalsForm.get('pets').value);
    this.pets = this.animalsForm.get('pets').value;

    this.runValidation();
    this.animalsForm.valueChanges.subscribe(() => {
      this.runValidation();
    });

    // Update Value and Validity for pets form if hasPets changes
    this.animalsForm.get('hasPets').valueChanges.subscribe(() => {
      this.animalsForm.get('pets').updateValueAndValidity();
    });

    // Updates the validations for the PetFormGroup
    this.animalsForm.get('addPetIndicator').valueChanges.subscribe(() => this.updateOnVisibility());

    // Shows the petsGroupForm if hasPets is true and none pets has been inserted yet
    if (this.stepEssFileService.havePets === 'Yes' && this.stepEssFileService.petsList.length === 0) {
      this.addPets();
      this.showPetsForm = true;
    }
  }

  hasPetsChange(event: MatRadioChange): void {
    if (event.value === 'Yes') {
      this.addPets();
    } else {
      if (this.pets.length > 0) {
        this.dialog
          .open(DialogComponent, {
            data: {
              component: InformationDialogComponent,
              content: globalConst.noPetsDialog
            },
            height: 'auto',
            width: '650px'
          })
          .afterClosed()
          .subscribe((response) => {
            if (response === 'confirm') {
              this.cancel();
              this.pets = [];
              this.petSource.next(this.pets);
              this.animalsForm.get('pets').setValue(this.pets);
            } else {
              this.animalsForm.get('hasPets').setValue('Yes');
            }
          });
      }
      this.cancel();
    }
  }

  addPets(): void {
    this.animalsForm.get('pet').reset();
    this.showPetsForm = true;
    this.animalsForm.get('addPetIndicator').setValue(true);
  }

  save(): void {
    if (this.animalsForm.get('pet').status === 'VALID') {
      if (this.editIndex !== undefined && this.rowEdit) {
        this.pets[this.editIndex] = this.animalsForm.get('pet').value;
        this.rowEdit = !this.rowEdit;
        this.editIndex = undefined;
      } else {
        this.pets.push(this.animalsForm.get('pet').value);
      }

      this.animalsForm.get('addPetIndicator').setValue(false);
      this.petSource.next(this.pets);
      this.animalsForm.get('pets').setValue(this.pets);
      this.showPetsForm = false;
    } else {
      this.animalsForm.get('pet').markAllAsTouched();
    }
  }

  cancel(): void {
    this.showPetsForm = false;
    this.animalsForm.get('pet').reset();
    this.animalsForm.get('addPetIndicator').setValue(false);

    if (this.pets.length === 0) {
      this.animalsForm.get('hasPets').setValue('No');
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
  public get petFormGroup(): UntypedFormGroup {
    return this.animalsForm.get('pet') as UntypedFormGroup;
  }

  deleteRow(index: number): void {
    this.dialog
      .open(DialogComponent, {
        data: {
          component: InformationDialogComponent,
          content: globalConst.petDeleteDialog
        },
        height: 'auto',
        width: '650px'
      })
      .afterClosed()
      .subscribe((event) => {
        if (event === 'confirm') {
          this.pets.splice(index, 1);
          this.petSource.next(this.pets);
          this.animalsForm.get('pets').setValue(this.pets);
          this.animalsForm.get('addPetIndicator').setValue(false);

          if (this.pets.length === 0) {
            this.animalsForm.get('hasPets').setValue('No');
          }
        }
      });
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
   * When navigating away from tab, update variable value and status indicator
   */
  ngOnDestroy(): void {
    if (this.stepEssFileService.checkForEdit()) {
      const isFormUpdated = this.wizardService.hasChanged(this.animalsForm.controls, 'animals');

      const hasPetsUpdated = this.wizardService.hasPetsChanged(this.pets);

      this.wizardService.setEditStatus({
        tabName: 'animals',
        tabUpdateStatus: isFormUpdated || hasPetsUpdated
      });
      this.stepEssFileService.updateEditedFormStatus();
    }
  }

  /**
   * Generates the main Animals form
   */
  private createAnimalsForm(): void {
    if (!this.stepEssFileService.petsList) {
      this.stepEssFileService.petsList = [];
    }

    this.animalsForm = this.formBuilder.group({
      hasPets: [this.stepEssFileService.havePets, [Validators.required]],
      pets: [
        this.stepEssFileService.petsList,
        this.customValidation
          .conditionalValidation(() => this.animalsForm.get('hasPets').value === 'Yes', Validators.required)
          .bind(this.customValidation)
      ],
      pet: this.createPetForm(),
      addPetIndicator: [false]
    });
  }

  /**
   * Generates a pet form to add them in the petList
   *
   * @returns a pet form
   */
  private createPetForm(): UntypedFormGroup {
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
            .conditionalValidation(() => this.animalsForm.get('addPetIndicator').value === true, Validators.required)
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
  private runValidation() {
    if (this.animalsForm.valid) {
      this.validPetsIndicator.emit(true);
    } else if (this.stepEssFileService.checkForPartialUpdates(this.animalsForm)) {
      this.validPetsIndicator.emit(false);
    } else {
      this.validPetsIndicator.emit(false);
    }
    this.saveFormData();
  }

  /**
   * Saves information inserted inthe form into the service
   */
  private saveFormData() {
    this.stepEssFileService.havePets = this.animalsForm.get('hasPets').value;
    this.stepEssFileService.petsList = this.animalsForm.get('pets').value;
    this.stepEssFileService.addPetIndicator = this.animalsForm.get('addPetIndicator').value;
  }
}
