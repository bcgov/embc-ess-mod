import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { EvacuationFileHouseholdMember } from 'src/app/core/api/models';
import { DialogContent } from 'src/app/core/models/dialog-content.model';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
import { ProfileSecurityQuestionsService } from 'src/app/feature-components/search/profile-security-questions/profile-security-questions.service';

@Component({
  selector: 'app-file-dashboard-verify-dialog',
  templateUrl: './file-dashboard-verify-dialog.component.html',
  styleUrls: ['./file-dashboard-verify-dialog.component.scss']
})
export class FileDashboardVerifyDialogComponent implements OnInit {
  @Input() content: DialogContent;
  @Input() profileData: EvacuationFileHouseholdMember;
  @Output() outputEvent = new EventEmitter<string>();
  verificationForm: UntypedFormGroup;
  hasSecurityQues = false;
  noIdFlag = true;

  constructor(
    private formBuilder: UntypedFormBuilder,
    public evacueeSessionService: EvacueeSessionService,
    private profileSecurityQuestionsService: ProfileSecurityQuestionsService
  ) {}

  ngOnInit(): void {
    this.createVerificationForm();
    this.checkForSecurityQues(this.profileData.linkedRegistrantId);
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

  checkForSecurityQues(id: string) {
    this.profileSecurityQuestionsService.getSecurityQuestions(id).subscribe({
      next: (results) => {
        if (results.questions.length === 0) {
          this.hasSecurityQues = false;
        } else {
          this.hasSecurityQues = true;
        }
      }
    });
  }

  isOptionDisabled(): boolean {
    return this.evacueeSessionService.isPaperBased || !this.hasSecurityQues;
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

  /**
   * Enables message flag is no identification is provided
   *
   * @param $event radio button change event
   */
  isVerified($event: MatRadioChange): void {
    if (
      ($event.value === 'No' && this.evacueeSessionService.isPaperBased) ||
      ($event.value === 'No' &&
        !this.evacueeSessionService.isPaperBased &&
        !this.hasSecurityQues)
    ) {
      this.noIdFlag = false;
    } else {
      this.noIdFlag = true;
    }
  }
}
