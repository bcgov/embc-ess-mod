import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { BehaviorSubject } from 'rxjs';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import * as globalConst from '../../../../core/services/global-constants'
import { StepCreateEssFileService } from '../../step-create-ess-file/step-create-ess-file.service';
import { DeleteHouseholdDialogComponent } from '../../../../shared/components/dialog-components/delete-household-dialog/delete-household-dialog.component';
import { CacheService } from 'src/app/core/services/cache.service';

@Component({
  selector: 'app-household-members',
  templateUrl: './household-members.component.html',
  styleUrls: ['./household-members.component.scss']
})
export class HouseholdMembersComponent implements OnInit {
  householdForm: FormGroup;
  dataSource = new BehaviorSubject([]);
  data = [];
  radioOption = globalConst.radioButtonOptions1;
  editIndex: number;
  rowEdit = false;
  editFlag = false;
  showMemberForm = false;
  displayedColumns: string[] = [
    'firstName',
    'lastName',
    'initials',
    'gender',
    'dateOfBirth',
    'buttons'
  ];

  constructor(
    private dialog: MatDialog, private stepCreateEssFileService: StepCreateEssFileService,
    private formBuilder: FormBuilder, private customValidation: CustomValidationService) {}

  ngOnInit(): void {
    this.createHouseholdForm();
    if(this.stepCreateEssFileService.houseHoldMembers.length !== 0) {
      this.data = this.stepCreateEssFileService.houseHoldMembers;
    } 
  }

  createHouseholdForm(): void {
    this.householdForm = this.formBuilder.group({
      haveHouseholdMembers: [
        this.stepCreateEssFileService.haveHouseHoldMembers !== null
          ? this.stepCreateEssFileService.haveHouseHoldMembers
          : '', Validators.required
      ],
      houseHoldMembers: [this.stepCreateEssFileService.houseHoldMembers.length !== 0
        ? this.stepCreateEssFileService.houseHoldMembers: [new FormArray([this.createHoulseholdMemberForm()])],
        this.customValidation
        .conditionalValidation(
          () =>
            this.householdForm.get('haveHouseholdMembers').value === true,
            Validators.required
        )
        .bind(this.customValidation)],
      houseHoldMember: [this.createHoulseholdMemberForm(),
        [
        this.customValidation
          .conditionalValidation(
            () =>
              this.householdForm.get('haveHouseholdMembers').value === true,
              Validators.required
          )
          .bind(this.customValidation)
      ]
    ],
      haveSpecialDiet: [
        this.stepCreateEssFileService.haveSpecialDieT !== null
          ? this.stepCreateEssFileService.haveSpecialDieT
          : '',
        Validators.required
      ],
      specialDietDetails: [
        this.stepCreateEssFileService.specialDietDetailS !== undefined
          ? this.stepCreateEssFileService.specialDietDetailS
          : '',
          [
            this.customValidation
              .conditionalValidation(
                () =>
                  this.householdForm.get('haveSpecialDiet').value === true,
                  this.customValidation.whitespaceValidator()
              )
              .bind(this.customValidation)
          ]
      ],
      haveMedication: [
        this.stepCreateEssFileService.haveMedicatioN !== null
          ? this.stepCreateEssFileService.haveMedicatioN
          : '',
          Validators.required
      ],
      medicationSupply: [
        this.stepCreateEssFileService.medicationSupplY !== null
          ? this.stepCreateEssFileService.medicationSupplY
          : '',
          [
            this.customValidation
              .conditionalValidation(
                () =>
                  this.householdForm.get('haveMedication').value === true,
                Validators.required
              )
              .bind(this.customValidation)
          ]
      ]
    });
  }

  private createHoulseholdMemberForm(): FormGroup {
    return this.formBuilder.group({
      firstName: [
        this.stepCreateEssFileService?.houseHoldMember?.firstName !== undefined
          ? this.stepCreateEssFileService.houseHoldMember.firstName
          : '',
        [this.customValidation.whitespaceValidator()]
      ],
      lastName: [
        this.stepCreateEssFileService?.houseHoldMember?.lastName !== undefined
          ? this.stepCreateEssFileService.houseHoldMember.lastName
          : '', [this.customValidation.whitespaceValidator()]
      ],
      dateOfBirth: [
        this.stepCreateEssFileService?.houseHoldMember?.dateOfBirth !== undefined
          ? this.stepCreateEssFileService.houseHoldMember.dateOfBirth
          : '',
        [Validators.required]
      ],
      gender: [
        this.stepCreateEssFileService?.houseHoldMember?.gender !== undefined
          ? this.stepCreateEssFileService.houseHoldMember?.gender
          : '', [Validators.required]
      ],
      initials: [
        this.stepCreateEssFileService?.houseHoldMember?.initials !== undefined
          ? this.stepCreateEssFileService.houseHoldMember.initials
          : ''
      ],
      preferredName: [
        this.stepCreateEssFileService?.houseHoldMember?.preferredName !== undefined
          ? this.stepCreateEssFileService.houseHoldMember.preferredName
          : ''
      ],
      sameLastNameCheck: [
        this.stepCreateEssFileService?.sameLastNameChecK !== null
          ? this.stepCreateEssFileService.sameLastNameChecK
          : ''
      ]
    });
  }


  /**
   * Returns the control of the household member form
   */
   public get houseHoldMemberFormGroup(): FormGroup {
    return this.householdForm.get('houseHoldMember').value;
  }

  /**
   * Returns the control of the form
   */
   get householdFormControl(): { [key: string]: AbstractControl } {
    return this.householdForm.controls;
  }

  /**
   * 
   */
  addMembers(): void {
    this.householdForm.get('houseHoldMember').value.reset();
    this.showMemberForm = !this.showMemberForm;
    this.editFlag = !this.editFlag;
  }

  /**
   * Allows editing information from inserted household members
   * @param element 
   * @param index 
   */
  editRow(element, index): void {
    this.editIndex = index;
    this.rowEdit = !this.rowEdit;
    this.householdForm.get('houseHoldMember').value.setValue(element);
    this.showMemberForm = !this.showMemberForm;
    this.editFlag = !this.editFlag;
  }

  /**
   * Saves householdmembers in the Evacuation File Form
   */
  save(): void {
    if (this.householdForm.get('houseHoldMember').value.status === 'VALID') {
      if (this.editIndex !== undefined && this.rowEdit) {
        this.data[this.editIndex] =
          this.householdForm.get('houseHoldMember').value.value;
        this.rowEdit = !this.rowEdit;
        this.editIndex = undefined;
      } else {
        this.data.push(this.householdForm.get('houseHoldMember').value.value);
      }
      this.dataSource.next(this.data);
      this.householdForm.get('houseHoldMembers').setValue(this.data);
      this.householdForm.get('houseHoldMember').value.reset();
      this.showMemberForm = !this.showMemberForm;
      this.editFlag = !this.editFlag;
    } else {
      this.householdForm.get('houseHoldMember').value.markAllAsTouched();
    }
  }

  /**
   * Resets the househol Member form and goes back to the main Form
   */
  cancel(): void {
    this.householdForm.get('houseHoldMember').value.reset();
    this.showMemberForm = !this.showMemberForm;
    this.editFlag = !this.editFlag;

    if (this.data.length === 0) {
      this.householdForm.get('haveHouseholdMembers').setValue(false);
    }
  }

  /**
   * Deletes the selected household member from the table list
   * @param index 
   */
  deleteRow(index: number): void {
    this.dialog
      .open(DialogComponent, {
        data: {component: DeleteHouseholdDialogComponent},
        height: 'auto',
        width: '550px'
      })
      .afterClosed()
      .subscribe((event) => {
        if (event === 'delete') {
          this.data.splice(index, 1);
          this.dataSource.next(this.data);
          this.householdForm.get('houseHoldMembers').setValue(this.data);
          if (this.data.length === 0) {
            this.householdForm.get('haveHouseholdMembers').setValue(false);
          }
        }
     });
  }


  /**
   * Listen to changes on Have medication option to display the 72 hours medication supply field
   * @param event 
   */
  hasHouseholdMembers(event: MatRadioChange): void{
    
    if (event.value === false) {
      this.showMemberForm = false;
      this.householdForm.get('houseHoldMember').value.reset();
      this.editFlag = !this.editFlag;
    } else {
      this.showMemberForm = true;
      this.editFlag = !this.editFlag;
    }
  }

   /**
   * Listen to changes on special diet option to display the special diet details field
   * @param event 
   */
    hasSpecialDietChange(event: MatRadioChange): void {
      if (event.value === false) {
        this.householdForm.get('specialDietDetails').reset();
      }
    }

   /**
   * Listen to changes on medication option to show the 72 hours supply option
   * @param event 
   */
    hasMedicationChange(event: MatRadioChange): void {
      if (event.value === false) {
        this.householdForm.get('medicationSupply').reset();
      }
    }

  // updateOnVisibility(): void {
  //   this.householdForm
  //     .get('householdMember.firstName')
  //     .updateValueAndValidity();
  //   this.householdForm
  //     .get('householdMember.lastName')
  //     .updateValueAndValidity();
  //   this.householdForm
  //     .get('householdMember.gender')
  //     .updateValueAndValidity();
  //   this.householdForm
  //     .get('householdMember.dateOfBirth')
  //     .updateValueAndValidity();
  // }

  back(): void {}
  next(): void {

  }
}
