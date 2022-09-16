import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { StepEssFileService } from '../../step-ess-file/step-ess-file.service';
import * as globalConst from '../../../../core/services/global-constants';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';
import { MatRadioChange } from '@angular/material/radio';
import { InformationDialogComponent } from 'src/app/shared/components/dialog-components/information-dialog/information-dialog.component';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Pet } from 'src/app/core/api/models';
import { WizardService } from '../../wizard.service';
import { TabModel } from 'src/app/core/models/tab.model';

@Component({
  selector: 'app-animals',
  templateUrl: './animals.component.html',
  styleUrls: ['./animals.component.scss']
})
export class AnimalsComponent implements OnInit, OnDestroy {
  animalsForm: UntypedFormGroup;
  radioOption = globalConst.radioButtonOptions;
  showPetsForm = false;
  displayedColumns: string[] = ['type', 'quantity', 'buttons'];
  petSource = new BehaviorSubject([]);
  pets: Pet[] = [];
  editIndex: number;
  rowEdit = false;
  showTable = true;
  tabUpdateSubscription: Subscription;
  tabMetaData: TabModel;

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

    // Set "update tab status" method, called for any tab navigation
    this.tabUpdateSubscription =
      this.stepEssFileService.nextTabUpdate.subscribe(() => {
        this.updateTabStatus();
      });

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
      this.stepEssFileService.havePets === 'Yes' &&
      this.stepEssFileService.petsList.length === 0
    ) {
      this.addPets();
      this.showPetsForm = true;
    }

    this.tabMetaData = this.stepEssFileService.getNavLinks('animals');
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
              this.animalsForm.get('hasPetsFood').reset();
              this.animalsForm.get('petCareDetails').reset();
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
            this.animalsForm.get('hasPetsFood').reset();
            this.animalsForm.get('petCareDetails').reset();
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
   * Goes back to the previous ESS File Tab
   */
  back() {
    this.router.navigate([this.tabMetaData?.previous]);
  }

  /**
   * Goes to the next tab from the ESS File
   */
  next(): void {
    this.router.navigate([this.tabMetaData?.next]);
  }

  /**
   * When navigating away from tab, update variable value and status indicator
   */
  ngOnDestroy(): void {
    if (this.stepEssFileService.checkForEdit()) {
      const isFormUpdated = this.wizardService.hasChanged(
        this.animalsForm.controls,
        'animals'
      );

      const hasPetsUpdated = this.wizardService.hasPetsChanged(this.pets);

      this.wizardService.setEditStatus({
        tabName: 'animals',
        tabUpdateStatus: isFormUpdated || hasPetsUpdated
      });
      this.stepEssFileService.updateEditedFormStatus();
    }
    this.stepEssFileService.nextTabUpdate.next();
    this.tabUpdateSubscription.unsubscribe();
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
          .conditionalValidation(
            () => this.animalsForm.get('hasPets').value === 'Yes',
            Validators.required
          )
          .bind(this.customValidation)
      ],
      hasPetsFood: [
        this.stepEssFileService.havePetsFood,
        this.customValidation
          .conditionalValidation(
            () => this.animalsForm.get('hasPets').value === 'Yes',
            Validators.required
          )
          .bind(this.customValidation)
      ],
      petCareDetails: [this.stepEssFileService.petCarePlans],
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
      this.stepEssFileService.setTabStatus('animals', 'complete');
    } else if (
      this.stepEssFileService.checkForPartialUpdates(this.animalsForm)
    ) {
      this.stepEssFileService.setTabStatus('animals', 'incomplete');
    } else {
      this.stepEssFileService.setTabStatus('animals', 'not-started');
    }
    this.saveFormData();
  }

  /**
   * Saves information inserted inthe form into the service
   */
  private saveFormData() {
    this.stepEssFileService.havePets = this.animalsForm.get('hasPets').value;
    this.stepEssFileService.petsList = this.animalsForm.get('pets').value;
    this.stepEssFileService.havePetsFood =
      this.animalsForm.get('hasPetsFood').value;
    this.stepEssFileService.petCarePlans =
      this.animalsForm.get('petCareDetails').value;
    this.stepEssFileService.addPetIndicator =
      this.animalsForm.get('addPetIndicator').value;
  }
}
