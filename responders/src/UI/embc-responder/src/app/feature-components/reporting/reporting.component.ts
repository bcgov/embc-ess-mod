import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReportsService } from 'src/app/core/api/services';
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

  constructor(
    private builder: FormBuilder,
    private reportService: ReportsService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.createReportingForm();
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
    this.isLoading = true;
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
   * Creates a new form to handle the addition of new supplier to the system
   */
  private createReportingForm(): void {
    this.reportForm = this.builder.group({
      taskNumber: [''],
      fileId: [''],
      evacuatedFrom: [''],
      evacuatedTo: ['']
    });
  }
}
