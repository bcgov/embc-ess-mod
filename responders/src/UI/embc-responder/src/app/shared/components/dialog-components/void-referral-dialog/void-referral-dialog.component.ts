import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Code } from 'src/app/core/api/models';
import { SupportVoidReason } from 'src/app/core/api/models/support-void-reason';
import { StepSupportsService } from 'src/app/feature-components/wizard/step-supports/step-supports.service';

@Component({
  selector: 'app-void-referral-dialog',
  templateUrl: './void-referral-dialog.component.html',
  styleUrls: ['./void-referral-dialog.component.scss']
})
export class VoidReferralDialogComponent implements OnInit {
  @Input() profileData: string;
  @Output() outputEvent = new EventEmitter<string>();
  voidForm: FormGroup;
  reasons: Code[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private stepSupportService: StepSupportsService
  ) {}

  ngOnInit(): void {
    this.voidReasonForm();
    this.reasons = this.stepSupportService.voidReasons;
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
}
