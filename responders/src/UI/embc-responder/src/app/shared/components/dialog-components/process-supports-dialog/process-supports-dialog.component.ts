import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ReviewSupportService } from 'src/app/feature-components/wizard/support-components/review-support/review-support.service';

@Component({
  selector: 'app-process-supports-dialog',
  templateUrl: './process-supports-dialog.component.html',
  styleUrls: ['./process-supports-dialog.component.scss']
})
export class ProcessSupportsDialogComponent implements OnInit {
  @Output() outputEvent = new EventEmitter<string>();
  addEvacForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private reviewSupportService: ReviewSupportService
  ) {}

  ngOnInit(): void {
    this.createAddEvacueeSummForm();
  }

  evacueeSummChangeEvent(event: MatCheckboxChange): void {
    this.reviewSupportService.includeEvacueeSummary = event.checked;
  }

  confirm(): void {
    if (this.addEvacForm.get('addSummary').value === undefined) {
      this.reviewSupportService.includeEvacueeSummary = false;
    }
    this.outputEvent.emit('confirm');
  }

  cancel(): void {
    this.outputEvent.emit('cancel');
  }

  private createAddEvacueeSummForm(): void {
    this.addEvacForm = this.formBuilder.group({
      addSummary: ['']
    });
  }
}
