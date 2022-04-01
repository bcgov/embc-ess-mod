import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import {
  CommunityType,
  EvacuationFileStatus,
  HouseholdMemberType,
  InsuranceOption,
  NeedsAssessmentType,
  Support,
  SupportCategory,
  SupportMethod,
  SupportStatus,
  SupportSubCategory
} from '../core/api/models';
import { EvacuationFileModel } from '../core/models/evacuation-file.model';
import { StepSupportsService } from '../feature-components/wizard/step-supports/step-supports.service';

@Injectable({
  providedIn: 'root'
})
export class MockStepSupportsService extends StepSupportsService {
  public selectedSupportDetailValue: Support;
  public evacuationFileValue: EvacuationFileModel;

  set selectedSupportDetail(selectedSupportDetailVal: Support) {
    this.selectedSupportDetailValue = selectedSupportDetailVal;
  }

  get selectedSupportDetail(): Support {
    return this.selectedSupportDetailValue;
  }

  public selectedSupport: Support = {
    category: SupportCategory.Food,
    subCategory: SupportSubCategory.Food_Groceries,
    id: 'D2035834',
    fileId: '154150',
    createdOn: '2022-03-28T23:53:59Z',
    createdBy: 'Sue, T',
    createdByTeam: 'DEV Team',
    issuedOn: '2022-03-28T23:53:58Z',
    issuedBy: 'Sue, T',
    issuedByTeam: 'DEV Team',
    needsAssessmentId: '36e9fedc-ffcf-4aa9-a177-10f211ecfc33',
    from: '2022-03-28T23:53:00Z',
    to: '2022-03-29T23:54:00Z',
    status: SupportStatus.Active,
    method: SupportMethod.Referral,
    supportDelivery: {
      method: SupportMethod.Referral
    },
    includedHouseholdMembers: ['76d303d5-7466-47ad-9df8-0c117fa56980']
  };

  getNeedsAssessmentInfo(
    fileId: string,
    needsAssessmentId: string
  ): Observable<EvacuationFileModel> {
    return new BehaviorSubject<EvacuationFileModel>(this.evacuationFileValue);
  }
}
