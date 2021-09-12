import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { SupportReprintReason } from 'src/app/core/api/models';

@Component({
  selector: 'app-reprint-referral-dialog',
  templateUrl: './reprint-referral-dialog.component.html',
  styleUrls: ['./reprint-referral-dialog.component.scss']
})
export class ReprintReferralDialogComponent implements OnInit {
  @Input() profileData: string;
  @Output() outputEvent = new EventEmitter<string>();
  reprintForm: FormGroup;
  reasons = SupportReprintReason;

  constructor(private formBuilder: FormBuilder) {}

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
    this.outputEvent.emit('close');
  }

  /**
   * Verifies if the evacuee has shown identification or
   * not and updates the value via api
   */
  void(): void {
    if (!this.reprintForm.valid) {
      this.reprintForm.get('reason').markAsTouched();
    } else {
      if (this.reprintForm.get('reason').value) {
        this.outputEvent.emit(this.reprintForm.get('reason').value);
      }
    }
  }
}
