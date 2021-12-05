import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ReportsService } from 'src/app/core/api/services';
import { ReportParams } from 'src/app/core/models/report-params.model';
import {
  Community,
  LocationsService
} from 'src/app/core/services/locations.service';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import * as globalConst from '../../core/services/global-constants';

@Component({
  selector: 'app-reporting',
  templateUrl: './reporting.component.html',
  styleUrls: ['./reporting.component.scss']
})
export class ReportingComponent implements OnInit {
  reportForm: FormGroup;
  // showLoader = false;
  color = '#FFFFFF';
  isLoading = false;
  city: Community[] = [];
  cityTo: Community[] = [];
  filteredOptionsEvacFrom: Observable<Community[]>;
  filteredOptionsEvacTo: Observable<Community[]>;

  constructor(
    private builder: FormBuilder,
    private reportService: ReportsService,
    private alertService: AlertService,
    private locationService: LocationsService
  ) {}

  ngOnInit(): void {
    this.createReportingForm();
    this.city = this.locationService.getCommunityList();
    this.cityTo = this.locationService.getCommunityList();

    this.filteredOptionsEvacFrom = this.reportForm
      .get('evacuatedFrom')
      .valueChanges.pipe(
        startWith(''),
        map((value) => (value ? this.filter(value) : this.city.slice()))
      );

    this.filteredOptionsEvacTo = this.reportForm
      .get('evacuatedTo')
      .valueChanges.pipe(
        startWith(''),
        map((value) => (value ? this.filterTo(value) : this.cityTo.slice()))
      );
  }

  evacueeReport(): void {
    this.isLoading = !this.isLoading;
    this.reportService
      .reportsGetEvacueeReport(this.reportForm.getRawValue())
      .subscribe(
        (reportResponse) => {
          // Downloading a csv document:
          const blob = new Blob([reportResponse], { type: 'text/csv' });
          const url = window.URL.createObjectURL(blob);
          const anchor = document.createElement('a');
          anchor.download = 'evacueeReport.csv';
          anchor.href = url;
          document.body.appendChild(anchor);
          anchor.click();
          document.body.removeChild(anchor);
          this.isLoading = !this.isLoading;
        },
        (error) => {
          this.isLoading = !this.isLoading;
          this.alertService.clearAlert();
          this.alertService.setAlert('danger', globalConst.evacueeReportError);
        }
      );
  }

  supportReport(): void {
    this.isLoading = !this.isLoading;
    console.log(this.getDataFromForm());
    this.reportService
      .reportsGetSupportReport(this.reportForm.getRawValue())
      .subscribe(
        (reportResponse) => {
          // Downloading a csv document:
          const blob = new Blob([reportResponse], { type: 'text/csv' });
          const url = window.URL.createObjectURL(blob);
          const anchor = document.createElement('a');
          anchor.download = 'supportReport.csv';
          anchor.href = url;
          document.body.appendChild(anchor);
          anchor.click();
          document.body.removeChild(anchor);
          this.isLoading = !this.isLoading;
        },
        (error) => {
          this.isLoading = !this.isLoading;
          this.alertService.clearAlert();
          this.alertService.setAlert('danger', globalConst.evacueeReportError);
        }
      );
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

  getEvacuatedTo(community: Community) {
    this.reportForm.get('evacuatedTo').setValue(community);
    this.reportForm.get('evacuatedToCommCode').setValue(community.code);
  }

  /**
   * Checks if the city value exists in the list
   */
  validateEvacuatedFrom(): boolean {
    const currentCity = this.reportForm.get('evacuatedFrom').value;
    let invalidCity = false;
    if (currentCity !== null && currentCity.name === undefined) {
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
    if (currentCity !== null && currentCity.name === undefined) {
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
      return this.city.filter((option) =>
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
    this.reportForm = this.builder.group({
      taskNumber: [''],
      fileId: [''],
      evacuatedFrom: [''],
      evacuatedFromCommCode: [''],
      evacuatedTo: [''],
      evacuatedToCommCode: ['']
    });
  }

  private getDataFromForm(): ReportParams {
    const results: ReportParams = {
      taskNumber: this.reportForm.get('taskNumber').value,
      fileId: this.reportForm.get('fileId').value,
      evacuatedFrom: this.reportForm.get('evacuatedFromCommCode').value,
      evacuatedTo: this.reportForm.get('evacuatedToCommCode').value
    };

    return results;
  }
}
