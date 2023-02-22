import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Observable, Subscription, timer } from 'rxjs';
import { map, retry, startWith, switchMap } from 'rxjs/operators';
import { ReportsService } from 'src/app/core/api/services';
import { ReportParams } from 'src/app/core/models/report-params.model';
import {
  Community,
  LocationsService
} from 'src/app/core/services/locations.service';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import * as globalConst from '../../core/services/global-constants';
import * as moment from 'moment';
import { CustomValidationService } from '../../core/services/customValidation.service';
import { padFileIdForSearch } from '../../core/services/helper/search.formatter';

@Component({
  selector: 'app-reporting',
  templateUrl: './reporting.component.html',
  styleUrls: ['./reporting.component.scss']
})
export class ReportingComponent implements OnInit, OnDestroy {
  reportForm: UntypedFormGroup;
  showErrorMessage = false;
  color = '#FFFFFF';
  isLoading = false;
  cityFrom: Community[] = [];
  cityTo: Community[] = [];
  filteredOptionsEvacFrom: Observable<Community[]>;
  filteredOptionsEvacTo: Observable<Community[]>;

  private evacueeReportPoll$: Subscription;
  private supportReportPoll$: Subscription;

  constructor(
    private builder: UntypedFormBuilder,
    private reportService: ReportsService,
    private alertService: AlertService,
    private locationService: LocationsService,
    private customValidation: CustomValidationService
  ) {}

  ngOnInit(): void {
    this.createReportingForm();
    this.cityFrom = this.locationService.getCommunityList();
    this.cityTo = this.locationService.getCommunityList();

    this.filteredOptionsEvacFrom = this.reportForm
      .get('evacuatedFrom')
      .valueChanges.pipe(
        startWith(''),
        map((value) => (value ? this.filter(value) : this.cityFrom.slice()))
      );

    this.filteredOptionsEvacTo = this.reportForm
      .get('evacuatedTo')
      .valueChanges.pipe(
        startWith(''),
        map((value) => (value ? this.filterTo(value) : this.cityTo.slice()))
      );
  }
  ngOnDestroy(): void {
    if (this.evacueeReportPoll$) {
      this.evacueeReportPoll$.unsubscribe();
    }
    if (this.supportReportPoll$) {
      this.supportReportPoll$.unsubscribe();
    }
  }

  evacueeReport(): void {
    if (!this.reportForm.valid) {
      this.showErrorMessage = true;
    } else {
      this.showErrorMessage = false;
      this.isLoading = !this.isLoading;
      this.evacueeReportPoll$ = this.reportService
        .reportsCreateEvacueeReport(this.getDataFromForm())
        .pipe(
          switchMap((reportId) =>
            this.reportService
              .reportsGetEvacueeReport({ reportRequestId: reportId })
              // try to get the report for 5 minutes
              .pipe(retry({ delay: 6000, count: 50 }))
          )
        )
        .subscribe({
          next: (reportResponse) => {
            this.downloadFile(
              reportResponse,
              'Evacuee_Export_' + moment().format('YYYYMMDD_HHmmss') + '.csv'
            );
            this.isLoading = !this.isLoading;
          },
          error: (_) => {
            console.error('Evacuees report was not ready on time');
            this.isLoading = !this.isLoading;
            this.alertService.clearAlert();
            this.alertService.setAlert(
              'danger',
              globalConst.evacueeReportError
            );
          }
        });
    }
  }

  downloadFile(file: Blob, fileName: string): void {
    const blob = new Blob([file], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.download = fileName;
    anchor.href = url;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }

  supportReport(): void {
    if (!this.reportForm.valid) {
      this.showErrorMessage = true;
    } else {
      this.showErrorMessage = false;
      this.isLoading = !this.isLoading;
      this.supportReportPoll$ = this.reportService
        .reportsCreateSupportReport(this.getDataFromForm())
        .pipe(
          switchMap((reportId) =>
            this.reportService
              .reportsGetSupportReport({ reportRequestId: reportId })
              // try to get the report for 5 minutes
              .pipe(retry({ delay: 6000, count: 50 }))
          )
        )
        .subscribe({
          next: (reportResponse) => {
            this.downloadFile(
              reportResponse,
              'Support_Export_' + moment().format('YYYYMMDD_HHmmss') + '.csv'
            );
            this.isLoading = !this.isLoading;
          },
          error: (_) => {
            console.error('Evacuees report was not ready on time');
            this.isLoading = !this.isLoading;
            this.alertService.clearAlert();
            this.alertService.setAlert(
              'danger',
              globalConst.evacueeReportError
            );
          }
        });
    }
  }

  /**
   * Returns the display value of autocomplete
   *
   * @param city : Selected city object
   */
  cityDisplayFrom(city: Community): string {
    if (city) {
      return city.name;
    }
  }

  /**
   * Returns the display value of autocomplete
   *
   * @param city : Selected city object
   */
  cityDisplayTo(city: Community): string {
    if (city) {
      return city.name;
    }
  }

  getEvacuatedFrom(community: Community) {
    this.reportForm.get('evacuatedFrom').setValue(community);
    this.reportForm.get('evacuatedFromCommCode').setValue(community.code);
  }

  getEvacuatedFromBlank() {
    if (this.reportForm.get('evacuatedFrom').value === '') {
      this.reportForm.get('evacuatedFromCommCode').setValue('');
    }
  }

  getEvacuatedTo(community: Community) {
    this.reportForm.get('evacuatedTo').setValue(community);
    this.reportForm.get('evacuatedToCommCode').setValue(community.code);
  }

  getEvacuatedToBlank() {
    if (this.reportForm.get('evacuatedTo').value === '') {
      this.reportForm.get('evacuatedToCommCode').setValue('');
    }
  }

  /**
   * Checks if the city value exists in the list
   */
  validateEvacuatedFrom(): boolean {
    const currentCity = this.reportForm.get('evacuatedFrom').value;
    let invalidCity = false;
    if (currentCity !== '' && currentCity.name === undefined) {
      invalidCity = !invalidCity;
      this.reportForm.get('evacuatedFrom').setErrors({ invalidCity: true });
    }
    return invalidCity;
  }

  /**
   * Checks if the city value exists in the list
   */
  validateEvacuatedTo(): boolean {
    const currentCity = this.reportForm.get('evacuatedTo').value;
    let invalidCity = false;
    if (currentCity !== '' && currentCity.name === undefined) {
      invalidCity = !invalidCity;
      this.reportForm.get('evacuatedTo').setErrors({ invalidCity: true });
    }
    return invalidCity;
  }

  /**
   * Filters the city list for autocomplete field
   *
   * @param value : User typed value
   */
  private filter(value?: string): Community[] {
    if (value !== null && value !== undefined && typeof value === 'string') {
      const filterValue = value.toLowerCase();
      return this.cityFrom.filter((option) =>
        option.name.toLowerCase().includes(filterValue)
      );
    }
  }

  private filterTo(value?: string): Community[] {
    if (value !== null && value !== undefined && typeof value === 'string') {
      const filterValue = value.toLowerCase();
      return this.cityTo.filter((option) =>
        option.name.toLowerCase().includes(filterValue)
      );
    }
  }

  /**
   * Creates a new form to handle the addition of new supplier to the system
   */
  private createReportingForm(): void {
    this.reportForm = this.builder.group(
      {
        taskNumber: [''],
        fileId: [''],
        evacuatedFrom: [''],
        evacuatedFromCommCode: [''],
        evacuatedTo: [''],
        evacuatedToCommCode: [''],
        timePeriod: ['']
      },
      { validators: this.customValidation.atLeastOneValidator() }
    );
  }

  private getDataFromForm(): ReportParams {
    const timePeriod = this.reportForm.get('timePeriod').value;
    let from;
    let to;

    if (timePeriod) {
      to = new Date().toISOString();
      from = moment();
      switch (timePeriod) {
        case '24h':
          from = from.add(-1, 'd');
          break;
        case '1w':
          from = from.add(-1, 'w');
          break;
        case '1m':
          from = from.add(-1, 'M');
          break;
        case '3m':
          from = from.add(-3, 'M');
          break;
        case '6m':
          from = from.add(-6, 'M');
          break;
        default:
          break;
      }
      from = from.toDate().toISOString();
    }

    const results: ReportParams = {
      taskNumber: this.reportForm.get('taskNumber').value,
      fileId: padFileIdForSearch(this.reportForm.get('fileId').value),
      evacuatedFrom: this.reportForm.get('evacuatedFromCommCode').value,
      evacuatedTo: this.reportForm.get('evacuatedToCommCode').value,
      from,
      to
    };

    return results;
  }
}
