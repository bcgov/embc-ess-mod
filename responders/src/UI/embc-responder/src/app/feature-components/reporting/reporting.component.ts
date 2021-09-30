import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-reporting',
  templateUrl: './reporting.component.html',
  styleUrls: ['./reporting.component.scss']
})
export class ReportingComponent implements OnInit {
  reportForm: FormGroup;
  showLoader = false;
  color = '#FFFFFF';

  constructor(private builder: FormBuilder) {}

  ngOnInit(): void {
    this.createReportingForm();
  }

  evacueeReport(): void {}

  supportReport(): void {}

  /**
   * Creates a new form to handle the addition of new supplier to the system
   */
  private createReportingForm(): void {
    this.reportForm = this.builder.group({
      task: [''],
      supplierName: [''],
      essFile: [''],
      evacuatedFrom: [''],
      evacuatedTo: ['']
    });
  }
}
