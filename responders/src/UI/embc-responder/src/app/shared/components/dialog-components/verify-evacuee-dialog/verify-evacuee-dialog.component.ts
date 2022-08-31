import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { DialogContent } from 'src/app/core/models/dialog-content.model';
import { RegistrantProfileModel } from 'src/app/core/models/registrant-profile.model';

@Component({
  selector: 'app-verify-evacuee-dialog',
  templateUrl: './verify-evacuee-dialog.component.html',
  styleUrls: ['./verify-evacuee-dialog.component.scss']
})
export class VerifyEvacueeDialogComponent implements OnInit {
  @Input() content: DialogContent;
  @Input() profileData?: RegistrantProfileModel;
  @Output() outputEvent = new EventEmitter<string>();
  verificationForm: UntypedFormGroup;
  noIdFlag = true;

  constructor(private formBuilder: UntypedFormBuilder) {}

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
        //api call
        this.outputEvent.emit('verified');
      }
    }
  }

  /**
   * Enables message flag is no identification is provided
   *
   * @param $event radio button change event
   */
  isVerified($event: MatRadioChange): void {
    if (!$event.value) {
      this.noIdFlag = false;
    } else {
      this.noIdFlag = true;
    }
  }
}
