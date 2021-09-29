import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';
import { StepSupportsService } from '../../step-supports/step-supports.service';
import * as globalConst from '../../../../core/services/global-constants';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { EvacuationFileHouseholdMember } from 'src/app/core/api/models/evacuation-file-household-member';
import { SupportDetailsService } from './support-details.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { InformationDialogComponent } from 'src/app/shared/components/dialog-components/information-dialog/information-dialog.component';

@Component({
  selector: 'app-support-details',
  templateUrl: './support-details.component.html',
  styleUrls: ['./support-details.component.scss']
})
export class SupportDetailsComponent implements OnInit {
  currentDate: string;
  currentTime: string;
  now = Date.now();
  toggle = false;
  isVisible = true;
  supportDetailsForm: FormGroup;
  noOfDaysList = globalConst.supportNoOfDays;
  selectedStartDate: string;
  editFlag = false;

  constructor(
    private router: Router,
    public stepSupportsService: StepSupportsService,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder,
    private customValidation: CustomValidationService,
    private supportDetailsService: SupportDetailsService,
    private dialog: MatDialog
  ) {
    if (this.router.getCurrentNavigation() !== null) {
      if (this.router.getCurrentNavigation().extras.state !== undefined) {
        const state = this.router.getCurrentNavigation().extras.state;
        if (state?.action === 'edit') {
          this.editFlag = true;
        }
      }
    }
    this.currentDate = this.datePipe.transform(Date.now(), 'dd-MMM-yyyy');
    this.currentTime = this.datePipe.transform(Date.now(), 'HH:mm');
  }

  ngOnInit(): void {
    console.log(this.stepSupportsService.supportDetails);
    this.createSupportDetailsForm();
    this.supportDetailsForm.get('noOfDays').patchValue(1);
    this.supportDetailsForm.get('noOfDays').valueChanges.subscribe((value) => {
      this.updateValidToDate();
    });
    this.addExistingMembers();
  }

  /**
   * Navigates to select-support page
   */
  back() {
    this.stepSupportsService
      .openDataLossPopup(globalConst.supportDataLossDialog)
      .afterClosed()
      .subscribe((event) => {
        if (event === 'confirm') {
          this.router.navigate(['/ess-wizard/add-supports/view']);
        }
      });
  }

  /**
   * Toggles the details section
   */
  nextDetails() {
    this.isVisible = !this.isVisible;
  }

  /**
   * Hides the override form
   *
   * @param $event true/false
   */
  collapse($event: boolean) {
    this.toggle = false;
  }

  /**
   * Sets the time and date value from override form
   *
   * @param $event form group
   */
  setDateTime($event: FormGroup) {
    this.currentDate = $event.get('date').value;
    this.selectedStartDate = $event.get('date').value;
    this.currentTime = $event.get('time').value;
    this.toggle = false;
    this.supportDetailsForm.get('fromDate').patchValue(this.currentDate);
    this.supportDetailsForm
      .get('toDate')
      .patchValue(this.datePipe.transform(this.currentDate, 'MM/dd/yyyy'));
  }

  /**
   * Support details form
   */
  createSupportDetailsForm(): void {
    this.supportDetailsForm = this.formBuilder.group({
      fromDate: [
        this.stepSupportsService?.supportDetails?.fromDate
          ? new Date(this.stepSupportsService?.supportDetails?.fromDate)
          : new Date(this.currentDate),
        [this.customValidation.validDateValidator(), Validators.required]
      ],
      fromTime: [
        this.stepSupportsService?.supportDetails?.fromTime
          ? this.stepSupportsService?.supportDetails?.fromTime
          : this.currentTime,
        [Validators.required]
      ],
      noOfDays: [
        this.stepSupportsService?.supportDetails?.noOfDays
          ? this.stepSupportsService?.supportDetails?.noOfDays
          : '',
        [Validators.required]
      ],
      toDate: [
        {
          value: this.stepSupportsService?.supportDetails?.toDate
            ? this.stepSupportsService?.supportDetails?.toDate
            : this.datePipe.transform(this.currentDate, 'MM/dd/yyyy'),
          disabled: true
        }
      ],
      toTime: [
        this.stepSupportsService?.supportDetails?.toTime
          ? this.stepSupportsService?.supportDetails?.toTime
          : this.currentTime,
        [Validators.required]
      ],
      members: this.formBuilder.array(
        [],
        [this.customValidation.memberCheckboxValidator()]
      ),
      referral: this.supportDetailsService.generateDynamicForm(
        this.stepSupportsService?.supportTypeToAdd?.value
      )
    });
  }

  addExistingMembers() {
    if (this.stepSupportsService?.supportDetails?.members) {
      const members = this.supportDetailsForm.get('members') as FormArray;
      this.stepSupportsService?.supportDetails?.members.forEach((member) => {
        members.push(new FormControl(member));
      });
      this.nextDetails();
    }
  }

  /**
   * Returns the control of the form
   */
  get supportDetailsFormControl(): { [key: string]: AbstractControl } {
    return this.supportDetailsForm.controls;
  }

  /**
   * Sets and removes members from form array
   *
   * @param $event checkbox event
   * @param member selected household member
   */
  onChange($event: MatCheckboxChange, member: EvacuationFileHouseholdMember) {
    const members = this.supportDetailsForm.get('members') as FormArray;

    if ($event.checked) {
      members.push(new FormControl(member));
    } else {
      const i = members.controls.findIndex((x) => x.value === member);
      members.removeAt(i);
    }
  }

  /**
   * Selects all the checkbox
   *
   * @param $event checkbox event
   */
  selectAll($event: MatCheckboxChange) {
    const members = this.supportDetailsForm.get('members') as FormArray;
    if ($event.checked) {
      members.clear();
      this.stepSupportsService?.evacFile?.needsAssessment?.householdMembers.forEach(
        (member) => {
          members.push(new FormControl(member));
        }
      );
    } else {
      members.clear();
    }
  }

  /**
   * Checks if the member already exists
   *
   * @param member selected household member
   * @returns true/false
   */
  exists(member: EvacuationFileHouseholdMember) {
    const existingList: EvacuationFileHouseholdMember[] = this.supportDetailsForm.get(
      'members'
    ).value;
    return existingList.findIndex((value) => value.id === member.id) > -1;
  }

  isIndeterminate() {
    return (
      this.supportDetailsForm.get('members').value.length > 0 &&
      !this.isChecked()
    );
  }

  isChecked() {
    return (
      this.supportDetailsForm.get('members').value.length ===
      this.stepSupportsService?.evacFile?.needsAssessment?.householdMembers
        .length
    );
  }

  /**
   * Updates date field based on number of days to be added
   */
  updateValidToDate() {
    const currentVal = this.supportDetailsForm.get('toDate').value;
    const date = new Date(currentVal);
    const finalValue = this.datePipe.transform(
      date.setDate(date.getDate() + 2),
      'MM/dd/yyyy'
    );
    console.log(finalValue);
    this.supportDetailsForm.get('toDate').patchValue(finalValue);
  }

  /**
   * Navigates to support delivery page
   */
  addDelivery() {
    if (!this.supportDetailsForm.valid) {
      this.supportDetailsForm.markAllAsTouched();
    } else {
      this.stepSupportsService.supportDetails = this.supportDetailsForm.getRawValue();
      console.log(this.stepSupportsService.supportDetails);
      if (!this.editFlag) {
        this.router.navigate(['/ess-wizard/add-supports/delivery']);
      } else {
        this.router.navigate(['/ess-wizard/add-supports/delivery'], {
          state: { action: 'edit' }
        });
      }
    }
  }

  /**
   * Open support rate sheet
   */
  openRateSheet() {
    this.dialog.open(DialogComponent, {
      data: {
        component: InformationDialogComponent,
        content: this.stepSupportsService.getRateSheetContent()
      },
      width: '720px'
    });
  }

  backToEdit() {
    this.router.navigate(['/ess-wizard/add-supports/view-detail']);
  }
}
