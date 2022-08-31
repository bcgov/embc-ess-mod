import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ReviewSupportService } from 'src/app/feature-components/wizard/support-components/review-support/review-support.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-process-supports-dialog',
  templateUrl: './process-supports-dialog.component.html',
  styleUrls: ['./process-supports-dialog.component.scss']
})
export class ProcessSupportsDialogComponent implements OnInit {
  @Output() outputEvent = new EventEmitter<string>();
  addEvacForm: UntypedFormGroup;
  includesEtranfer = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: UntypedFormBuilder,
    private reviewSupportService: ReviewSupportService
  ) {}

  ngOnInit(): void {
    this.includesEtranfer = this.data.includesEtranfer;
    this.createAddEvacueeSummForm();
  }

  evacueeSummChangeEvent(event: MatCheckboxChange): void {
    this.reviewSupportService.includeEvacueeSummary = event.checked;
  }

  confirm(): void {
    if (this.addEvacForm.get('addSummary').value === undefined) {
      this.reviewSupportService.includeEvacueeSummary = false;
    }
    if (this.includesEtranfer)
      this.reviewSupportService.includeEvacueeSummary = true;
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
