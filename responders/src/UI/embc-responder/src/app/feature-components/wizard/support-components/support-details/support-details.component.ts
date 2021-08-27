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

  constructor(
    private router: Router,
    public stepSupportsService: StepSupportsService,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder,
    private customValidation: CustomValidationService
  ) {
    this.currentDate = this.datePipe.transform(Date.now(), 'dd-MMM-yyyy');
    this.currentTime = this.datePipe.transform(Date.now(), 'HH:mm');
  }

  ngOnInit(): void {
    this.createSupportDetailsForm();
    this.supportDetailsForm.get('noOfDays').patchValue(1);
    this.supportDetailsForm.get('noOfDays').valueChanges.subscribe((value) => {
      this.updateValidToDate();
    });
  }

  /**
   * Navigates to select-support page
   */
  back() {
    this.router.navigate(['/ess-wizard/add-supports/select-support']);
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
        new Date(this.currentDate),
        [this.customValidation.validDateValidator(), Validators.required]
      ],
      fromTime: [this.currentTime, [Validators.required]],
      noOfDays: ['', [Validators.required]],
      toDate: [
        {
          value: this.datePipe.transform(this.currentDate, 'MM/dd/yyyy'),
          disabled: true
        }
      ],
      toTime: [this.currentTime, [Validators.required]],
      members: this.formBuilder.array(
        [],
        [this.customValidation.memberCheckboxValidator()]
      )
    });
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
    return this.supportDetailsForm.get('members').value.indexOf(member) > -1;
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

  addDelivery() {
    if (!this.supportDetailsForm.valid) {
      this.supportDetailsForm.markAllAsTouched();
    } else {
      this.router.navigate(['/ess-wizard/add-supports/delivery']);
    }
  }
}
