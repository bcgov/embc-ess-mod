import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { SupportReprintReason } from 'src/app/core/api/models';
import { LoadEvacueeListService } from 'src/app/core/services/load-evacuee-list.service';

interface ReprintOutput {
  reason?: string;
  includeSummary?: boolean;
}

@Component({
  selector: 'app-reprint-referral-dialog',
  templateUrl: './reprint-referral-dialog.component.html',
  styleUrls: ['./reprint-referral-dialog.component.scss']
})
export class ReprintReferralDialogComponent implements OnInit {
  @Input() profileData: string;
  @Output() outputEvent = new EventEmitter<ReprintOutput>();
  reprintForm: UntypedFormGroup;
  reasons = SupportReprintReason;
  includeSummary = false;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private loadEvacueeListService: LoadEvacueeListService
  ) {}

  ngOnInit(): void {
    this.reprintReasonForm();
  }

  reprintReasonForm(): void {
    this.reprintForm = this.formBuilder.group({
      reason: ['', [Validators.required]]
    });
  }

  /**
   * Returns the control of the form
   */
  get reprintFormControl(): { [key: string]: AbstractControl } {
    return this.reprintForm.controls;
  }

  close(): void {
    this.outputEvent.emit({ reason: 'close' });
  }

  /**
   * Reprints the support
   */
  reprintSupport(): void {
    if (!this.reprintForm.valid) {
      this.reprintForm.get('reason').markAsTouched();
    } else {
      if (this.reprintForm.get('reason').value) {
        this.outputEvent.emit({
          reason: this.reprintForm.get('reason').value,
          includeSummary: this.includeSummary
        });
      }
    }
  }

  /**
   * Splits the reasons into words with spaces to be displayed to the user
   *
   * @param reasonOption options to choose for reasons for reprinting
   * @returns the same reason for reprinting with spaces between words.
   */
  getReasonDescription(reasonOption: string): string {
    return this.loadEvacueeListService
      .getReprintReasons()
      .find((reason) => reason.value === reasonOption).description;
  }

  evacueeSummChangeEvent(event: MatCheckboxChange): void {
    this.includeSummary = event.checked;
  }
}
