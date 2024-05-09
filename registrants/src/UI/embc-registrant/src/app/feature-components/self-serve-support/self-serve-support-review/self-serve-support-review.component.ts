import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DraftSupportForm, ETransferDetailsForm } from '../self-serve-support.model';
import { NeedsAssessmentService } from '../../needs-assessment/needs-assessment.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { ETransferNotificationPreference } from 'src/app/core/model/e-transfer-notification-preference.model';
import { DraftSupports, SelfServeShelterAllowanceSupport, SelfServeSupportType } from 'src/app/core/api/models';
import * as moment from 'moment';

export type GotoStepType = 'supportDetails' | 'eTransfer';

@Component({
  selector: 'app-self-serve-support-review',
  standalone: true,
  imports: [MatFormFieldModule, MatCheckboxModule, MatCardModule, ReactiveFormsModule],
  templateUrl: './self-serve-support-review.component.html',
  styleUrls: ['../self-serve-support-form.component.scss']
})
export class SelfServeSupportReviewComponent {
  SelfServeSupportType = SelfServeSupportType;
  ETransferNotificationPreference = ETransferNotificationPreference;
  essFileId = this.needsAssessmentService.getVerifiedEvacuationFileNo();

  @Input() supportDraftForm: FormGroup<DraftSupportForm>;
  @Input() eTransferDetailsForm: FormGroup<ETransferDetailsForm>;

  @Input() reviewAcknowledgeForm = new FormGroup({
    fundsExclusive: new FormControl('', Validators.requiredTrue),
    meetMyOwnNeeds: new FormControl('', Validators.requiredTrue),
    information: new FormControl('', Validators.requiredTrue)
  });

  shelterAllowanceDates = [];

  _draftSupports: DraftSupports;
  @Input()
  set draftSupports(draftSupports: DraftSupports) {
    const dates = (
      draftSupports.items.find(
        (s) => s.type === SelfServeSupportType.ShelterAllowance
      ) as SelfServeShelterAllowanceSupport
    )?.nights.map((d) => moment(d, 'YYYY-MM-DD'));

    if (dates) this.shelterAllowanceDates = [...dates];

    this._draftSupports = draftSupports;
  }

  get draftSupports() {
    return this._draftSupports;
  }

  @Output() gotoStep: EventEmitter<GotoStepType> = new EventEmitter<GotoStepType>();

  constructor(private needsAssessmentService: NeedsAssessmentService) {}
}
