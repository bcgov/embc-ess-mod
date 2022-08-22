import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { SupportVoidReason } from 'src/app/core/api/models/support-void-reason';
import { LoadEvacueeListService } from 'src/app/core/services/load-evacuee-list.service';

@Component({
  selector: 'app-void-referral-dialog',
  templateUrl: './void-referral-dialog.component.html',
  styleUrls: ['./void-referral-dialog.component.scss']
})
export class VoidReferralDialogComponent implements OnInit {
  @Input() profileData: string;
  @Input() voidType: string;
  @Output() outputEvent = new EventEmitter<string>();
  voidForm: UntypedFormGroup;
  reasons = SupportVoidReason;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private loadEvacueeListService: LoadEvacueeListService
  ) {}

  ngOnInit(): void {
    this.voidReasonForm();
  }

  voidReasonForm(): void {
    this.voidForm = this.formBuilder.group({
      reason: ['', [Validators.required]]
    });
  }

  /**
   * Returns the control of the form
   */
  get voidFormControl(): { [key: string]: AbstractControl } {
    return this.voidForm.controls;
  }

  close(): void {
    this.outputEvent.emit('close');
  }

  /**
   * Verifies if the evacuee has shown identification or
   * not and updates the value via api
   */
  void(): void {
    if (!this.voidForm.valid) {
      this.voidForm.get('reason').markAsTouched();
    } else {
      if (this.voidForm.get('reason').value) {
        this.outputEvent.emit(this.voidForm.get('reason').value);
      }
    }
  }

  cancel(): void {
    this.outputEvent.emit('cancel');
  }

  /**
   * Splits the reasons into words with spaces to be displayed to the user
   *
   * @param reasonOption options to choose for reasons for reprinting
   * @returns the same reason for reprinting with spaces between words.
   */
  getReasonDescription(reasonOption: string): string {
    return this.loadEvacueeListService
      .getVoidReasons()
      .find((reason) => reason?.value === reasonOption)?.description;
  }
}
