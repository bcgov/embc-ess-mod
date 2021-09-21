import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ReviewSupportService } from 'src/app/feature-components/wizard/support-components/review-support/review-support.service';

@Component({
  selector: 'app-process-supports-dialog',
  templateUrl: './process-supports-dialog.component.html',
  styleUrls: ['./process-supports-dialog.component.scss']
})
export class ProcessSupportsDialogComponent implements OnInit {
  @Output() outputEvent = new EventEmitter<string>();

  constructor(private reviewSupportService: ReviewSupportService) {}

  ngOnInit(): void {
    this.reviewSupportService.includeEvacueeSummary = false;
  }

  addEvacueeSummaryChangeEvent(event: MatCheckboxChange): void {
    this.reviewSupportService.includeEvacueeSummary = event.checked;
  }

  confirm(): void {
    this.outputEvent.emit('confirm');
  }

  cancel(): void {
    this.outputEvent.emit('cancel');
  }
}
