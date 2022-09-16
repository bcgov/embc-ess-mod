import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { RegistrationResult } from '../core/api/models';
import { EvacuationFileSummaryModel } from '../core/models/evacuation-file-summary.model';
import { RegistrantProfileModel } from '../core/models/registrant-profile.model';
import { EvacueeProfileService } from '../core/services/evacuee-profile.service';

@Injectable({
  providedIn: 'root'
})
export class MockEvacueeProfileService extends EvacueeProfileService {
  public evacuationFileSummaryValue: EvacuationFileSummaryModel[];
  public registrantProfileValue: RegistrantProfileModel;

  public getProfileFromId(
    profileId: string
  ): Observable<RegistrantProfileModel> {
    return new BehaviorSubject<RegistrantProfileModel>(
      this.registrantProfileValue
    );
  }

  public getProfileFiles(
    registrantId?: string,
    externalReferenceId?: string
  ): Observable<Array<EvacuationFileSummaryModel>> {
    return new BehaviorSubject<EvacuationFileSummaryModel[]>(
      this.evacuationFileSummaryValue
    );
  }

  public setVerifiedStatus(
    registrantId: string,
    verified: boolean
  ): Observable<RegistrantProfileModel> {
    return new BehaviorSubject<RegistrantProfileModel>(
      this.registrantProfileValue
    );
  }
}
