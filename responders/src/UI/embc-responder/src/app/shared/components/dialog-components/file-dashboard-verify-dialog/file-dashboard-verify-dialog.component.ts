import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { DialogContent } from 'src/app/core/models/dialog-content.model';
import { RegistrantProfileModel } from 'src/app/core/models/registrant-profile.model';

@Component({
  selector: 'app-file-dashboard-verify-dialog',
  templateUrl: './file-dashboard-verify-dialog.component.html',
  styleUrls: ['./file-dashboard-verify-dialog.component.scss']
})
export class FileDashboardVerifyDialogComponent implements OnInit {
  @Input() content: DialogContent;
  @Input() profileData?: RegistrantProfileModel;
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

  /**
   * Verifies if the evacuee has shown identification or
   * not and updates the value via api
   */
  verify(): void {
    if (!this.verificationForm.valid) {
      this.verificationForm.get('verified').markAsTouched();
    } else {
      if (this.verificationForm.get('verified').value) {
        this.outputEvent.emit(this.verificationForm.get('verified').value);
      }
    }
  }
}
