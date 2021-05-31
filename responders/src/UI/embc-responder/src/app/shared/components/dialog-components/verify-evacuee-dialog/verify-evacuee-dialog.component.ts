import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-verify-evacuee-dialog',
  templateUrl: './verify-evacuee-dialog.component.html',
  styleUrls: ['./verify-evacuee-dialog.component.scss']
})
export class VerifyEvacueeDialogComponent implements OnInit {
  @Output() outputEvent = new EventEmitter<string>();
  verificationForm: FormGroup;
  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.createVerificationForm();
  }

  createVerificationForm(): void {
    this.verificationForm = this.formBuilder.group({
      verified: ['', [Validators.required]]
    });
  }

  /**
   * Returns the control of the form
   */
  get verifiedFormControl(): { [key: string]: AbstractControl } {
    return this.verificationForm.controls;
  }

  close(): void {
    this.outputEvent.emit('close');
  }

  verify(): void {
    console.log('outhere');
    if (!this.verificationForm.valid) {
      console.log('inhere');
      this.verificationForm.markAsDirty();
      this.verificationForm.markAsTouched();
    }
  }
}
