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
import * as moment from 'moment';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { EvacuationFileHouseholdMember } from 'src/app/core/api/models/evacuation-file-household-member';
import { SupportDetailsService } from './support-details.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { InformationDialogComponent } from 'src/app/shared/components/dialog-components/information-dialog/information-dialog.component';
import { MatDatepickerInputEvent } from '@angular/material/datepicker/public-api';
import { SupportSubCategory } from 'src/app/core/api/models';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { ReferralCreationService } from '../../step-supports/referral-creation.service';
import { SupportSummary } from 'src/app/core/api/models/support-summary';

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
  noOfDaysList = [];
  selectedStartDate: string;
  editFlag = false;
  taskStartTime: string;
  showLoader = false;
  color = '#169BD5';

  constructor(
    private router: Router,
    public stepSupportsService: StepSupportsService,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder,
    private customValidation: CustomValidationService,
    private supportDetailsService: SupportDetailsService,
    private dialog: MatDialog,
    public evacueeSessionService: EvacueeSessionService,
    private alertService: AlertService,
    private referralCreationService: ReferralCreationService
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

  validDateFilter = (d: Date | null): boolean => {
    const date = d || new Date();
    return this.evacueeSessionService.isPaperBased
      ? moment(date).isBetween(
          moment(this.stepSupportsService?.evacFile?.task?.from),
          moment(this.stepSupportsService?.evacFile?.task?.to),
          'D',
          '[]'
        )
      : moment(date).isBetween(
          moment(new Date()),
          moment(this.stepSupportsService?.evacFile?.task?.to),
          'D',
          '[]'
        );
  };

  paperCompletedDateFilter = (d: Date | null): boolean => {
    const date = d || new Date();
    return moment(date).isBetween(
      moment(this.stepSupportsService?.evacFile?.task?.from),
      moment(new Date()),
      'D',
      '[]'
    );
  };

  ngOnInit(): void {
    this.createSupportDetailsForm();
    this.supportDetailsForm.get('noOfDays').valueChanges.subscribe((value) => {
      this.updateValidToDate(value);
    });

    this.supportDetailsForm.get('fromDate').valueChanges.subscribe((value) => {
      if (value === null || value === '' || value === undefined) {
        this.supportDetailsForm.get('noOfDays').patchValue(1);
      }
    });

    this.supportDetailsForm.get('toDate').valueChanges.subscribe((value) => {
      if (value === null || value === '' || value === undefined) {
        this.supportDetailsForm.get('noOfDays').patchValue(1);
      }
    });

    this.addExistingMembers();

    if (this.stepSupportsService?.supportDetails?.noOfDays === undefined) {
      this.supportDetailsForm.get('noOfDays').patchValue(1);
    }

    this.calculateNoOfDays();
  }

  checkDateRange(): boolean {
    const selectedFromDate = new Date(
      this.supportDetailsForm.get('fromDate').value
    );
    const updateFromDate = new Date(
      selectedFromDate.setDate(selectedFromDate.getDate() + 30)
    );
    return moment(this.supportDetailsForm.get('toDate').value).isSameOrBefore(
      moment(updateFromDate)
    );
  }

  calculateNoOfDays() {
    const taskStartDate = this.datePipe.transform(
      this.stepSupportsService?.evacFile?.task?.from,
      'dd-MMM-yyyy'
    );
    const taskEndDate = this.datePipe.transform(
      this.stepSupportsService?.evacFile?.task?.to,
      'dd-MMM-yyyy'
    );
    const dateDiff =
      new Date(taskEndDate).getTime() - new Date(taskStartDate).getTime();

    const counter = dateDiff / (1000 * 60 * 60 * 24) > 30 ? 30 : dateDiff;

    for (let i = 1; i <= counter; i++) {
      this.noOfDaysList.push(i);
    }
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
    this.currentDate = this.datePipe.transform(
      $event.get('date').value,
      'dd-MMM-yyyy'
    );
    const updatedSupportStartDate = new Date(
      this.datePipe.transform($event.get('date').value, 'yyyy-MM-dd') +
        'T' +
        $event.get('time').value +
        ':00'
    );
    this.now = updatedSupportStartDate.getTime();
    this.currentTime = this.datePipe.transform(
      updatedSupportStartDate,
      'hh:mm'
    );
    this.toggle = false;

    const nextDay = new Date();
    nextDay.setDate($event.get('date').value.getDate() + 1);

    this.supportDetailsForm
      .get('fromDate')
      .patchValue($event.get('date').value);
    this.supportDetailsForm
      .get('fromTime')
      .patchValue($event.get('time').value);
    this.supportDetailsForm
      .get('toDate')
      .patchValue(this.datePipe.transform(nextDay, 'MM/dd/yyyy'));
    this.supportDetailsForm.get('toTime').patchValue($event.get('time').value);
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
   * Checks if the given task date is in the past
   *
   * @param fromDate
   * @param toDate
   * @returns
   */
  validTaskDate(fromDate: string, toDate: string): boolean {
    if (moment(toDate).isBefore(fromDate)) {
      return false;
    } else {
      return true;
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
    const existingList: EvacuationFileHouseholdMember[] =
      this.supportDetailsForm.get('members').value;
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

  hideRateSheet(): boolean {
    return (
      this.stepSupportsService?.supportTypeToAdd?.value !==
      SupportSubCategory.Lodging_Group
    );
  }

  /**
   * Updates date field based on number of days to be added
   */
  updateValidToDate(days?: number): void {
    const currentVal = this.supportDetailsForm.get('fromDate').value;
    if (days !== null && currentVal !== '') {
      const date = new Date(currentVal);
      const finalValue = this.datePipe.transform(
        date.setDate(date.getDate() + days),
        'MM/dd/yyyy'
      );
      this.supportDetailsForm.get('toDate').patchValue(new Date(finalValue));
    }
  }

  /**
   * Updates To Date based of no of days
   *
   * @param event
   */
  updateToDate(event: MatDatepickerInputEvent<Date>) {
    const days = this.supportDetailsForm.get('noOfDays').value;
    const finalValue = this.datePipe.transform(
      event.value.setDate(event.value.getDate() + days),
      'MM/dd/yyyy'
    );
    this.supportDetailsForm.get('toDate').patchValue(new Date(finalValue));
  }

  /**
   * Updates No of days based on To Date selection
   *
   * @param event
   */
  updateNoOfDays(event: MatDatepickerInputEvent<Date>) {
    const fromDate = this.datePipe.transform(
      this.supportDetailsForm.get('fromDate').value,
      'dd-MMM-yyyy'
    );
    const toDate = this.datePipe.transform(event.value, 'dd-MMM-yyyy');
    const dateDiff = new Date(toDate).getTime() - new Date(fromDate).getTime();
    const days = dateDiff / (1000 * 60 * 60 * 24);

    if (days > 30) {
      this.supportDetailsForm.get('noOfDays').patchValue(null);
    } else {
      this.supportDetailsForm.get('noOfDays').patchValue(days);
    }
  }

  /**
   * Navigates to support delivery page
   */
  addDelivery() {
    if (!this.supportDetailsForm.valid) {
      this.supportDetailsForm.markAllAsTouched();
    } else {
      this.stepSupportsService.supportDetails =
        this.supportDetailsForm.getRawValue();
      if (this.evacueeSessionService.isPaperBased) {
        this.mapPaperFields();
      }
      if (!this.editFlag) {
        this.router.navigate(['/ess-wizard/add-supports/delivery']);
      } else {
        this.router.navigate(['/ess-wizard/add-supports/delivery'], {
          state: { action: 'edit' }
        });
      }
    }
  }

  mapPaperFields() {
    this.stepSupportsService.supportDetails.externalReferenceId =
      this.supportDetailsForm.get('paperSupportNumber').value;
    this.stepSupportsService.supportDetails.issuedBy =
      this.supportDetailsForm.get('paperIssuedBy.firstName').value +
      ' ' +
      this.supportDetailsForm.get('paperIssuedBy.lastNameInitial').value;
    this.stepSupportsService.supportDetails.issuedOn =
      this.supportDetailsForm.get('paperCompletedOn').value;
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

  /**
   * Navigates back to the View Details page
   */
  backToEdit() {
    this.router.navigate(['/ess-wizard/add-supports/view-detail']);
  }

  checkReferralNumber($event): void {
    this.showLoader = !this.showLoader;
    this.supportDetailsService
      .checkUniqueReferralNumber('R' + $event.target.value)
      .subscribe({
        next: (value) => {
          this.showLoader = !this.showLoader;
          console.log(value);
          const draftList = this.referralCreationService.getDraftSupport();
          const duplicateReferralList: SupportSummary[] = [
            ...value,
            ...draftList
          ];
          const filteredReferrals = duplicateReferralList.filter(
            (referrals) =>
              referrals.category ===
                this.stepSupportsService?.supportTypeToAdd?.value ||
              referrals.subCategory ===
                this.stepSupportsService?.supportTypeToAdd?.value
          );

          this.supportDetailsForm
            .get('paperSupportNumber')
            .setValidators([
              this.customValidation
                .userNameExistsValidator(filteredReferrals.length > 0)
                .bind(this.customValidation)
            ]);
          this.supportDetailsForm
            .get('paperSupportNumber')
            .updateValueAndValidity();
          if (value) {
            this.supportDetailsForm
              .get('paperSupportNumber')
              .updateValueAndValidity();
          } else {
            this.supportDetailsForm.updateValueAndValidity();
          }
        },
        error: (error) => {
          this.showLoader = !this.showLoader;
          this.alertService.clearAlert();
          this.alertService.setAlert('danger', globalConst.referralCheckerror);
        }
      });
  }

  private setFromDate() {
    if (this.evacueeSessionService.isPaperBased) {
      return this.stepSupportsService?.supportDetails?.fromDate
        ? this.stepSupportsService?.supportDetails?.fromDate
        : '';
    } else {
      return this.stepSupportsService?.supportDetails?.fromDate
        ? this.stepSupportsService?.supportDetails?.fromDate
        : new Date(
            this.stepSupportsService.convertStringToDate(
              this.datePipe.transform(Date.now(), 'dd-MMM-yyyy')
            )
          );
    }
  }

  private setFromTime() {
    if (this.evacueeSessionService.isPaperBased) {
      return this.stepSupportsService?.supportDetails?.fromTime
        ? this.stepSupportsService?.supportDetails?.fromTime
        : '';
    } else {
      return this.stepSupportsService?.supportDetails?.fromTime
        ? this.stepSupportsService?.supportDetails?.fromTime
        : this.currentTime;
    }
  }

  /**
   * Support details form
   */
  private createSupportDetailsForm(): void {
    this.supportDetailsForm = this.formBuilder.group({
      fromDate: [
        this.setFromDate(),
        [this.customValidation.validDateValidator(), Validators.required]
      ],
      fromTime: [this.setFromTime(), [Validators.required]],
      noOfDays: [
        this.stepSupportsService?.supportDetails?.noOfDays
          ? this.stepSupportsService?.supportDetails?.noOfDays
          : '',
        [Validators.required]
      ],
      toDate: [
        this.stepSupportsService?.supportDetails?.toDate
          ? this.stepSupportsService?.supportDetails?.toDate
          : '',
        [this.customValidation.validDateValidator(), Validators.required]
      ],
      toTime: [
        this.stepSupportsService?.supportDetails?.toTime
          ? this.stepSupportsService?.supportDetails?.toTime
          : '',
        [Validators.required]
      ],
      members: this.formBuilder.array(
        [],
        [this.customValidation.memberCheckboxValidator()]
      ),
      referral: this.supportDetailsService.generateDynamicForm(
        this.stepSupportsService?.supportTypeToAdd?.value
      ),
      paperSupportNumber: [
        this.stepSupportsService?.supportDetails?.externalReferenceId
          ? this.stepSupportsService?.supportDetails?.externalReferenceId
          : '',
        [
          this.customValidation
            .conditionalValidation(
              () => this.evacueeSessionService.isPaperBased,
              this.customValidation.whitespaceValidator()
            )
            .bind(this.customValidation),

          this.customValidation
            .conditionalValidation(
              () => this.evacueeSessionService.isPaperBased,
              Validators.minLength(8)
            )
            .bind(this.customValidation),
          this.customValidation
            .conditionalValidation(
              () => this.evacueeSessionService.isPaperBased,
              Validators.pattern(globalConst.supportNumberPattern)
            )
            .bind(this.customValidation)
        ]
      ],
      paperIssuedBy: this.formBuilder.group({
        firstName: [
          this.stepSupportsService?.supportDetails?.issuedBy?.split(' ')[0]
            ? this.stepSupportsService?.supportDetails?.issuedBy?.split(' ')[0]
            : '',
          [
            this.customValidation
              .conditionalValidation(
                () => this.evacueeSessionService.isPaperBased,
                this.customValidation.whitespaceValidator()
              )
              .bind(this.customValidation)
          ]
        ],
        lastNameInitial: [
          this.stepSupportsService?.supportDetails?.issuedBy?.split(' ')[1]
            ? this.stepSupportsService?.supportDetails?.issuedBy?.split(' ')[1]
            : '',
          [
            this.customValidation
              .conditionalValidation(
                () => this.evacueeSessionService.isPaperBased,
                this.customValidation.whitespaceValidator()
              )
              .bind(this.customValidation)
          ]
        ]
      }),
      paperCompletedOn: [
        this.stepSupportsService?.supportDetails?.issuedOn
          ? this.stepSupportsService?.supportDetails?.issuedOn
          : '',
        [
          this.customValidation
            .conditionalValidation(
              () => this.evacueeSessionService.isPaperBased,
              Validators.required
            )
            .bind(this.customValidation),
          this.customValidation
            .conditionalValidation(
              () => this.evacueeSessionService.isPaperBased,
              this.customValidation.validDateValidator()
            )
            .bind(this.customValidation)
        ]
      ]
    });
  }
}
