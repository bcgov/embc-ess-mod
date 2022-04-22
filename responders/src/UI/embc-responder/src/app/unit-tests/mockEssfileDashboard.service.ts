import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { EvacuationFileModel } from '../core/models/evacuation-file.model';
import {
  LinkedRegistrantProfileResults,
  LinkRegistrantProfileModel
} from '../core/models/link-registrant-profile.model';
import { EssfileDashboardService } from '../feature-components/search/essfile-dashboard/essfile-dashboard.service';

@Injectable({
  providedIn: 'root'
})
export class MockEssfileDashboardService extends EssfileDashboardService {
  public essFileValue: EvacuationFileModel;
  public possibleProfileMatches: LinkedRegistrantProfileResults = {
    matchedProfiles: []
  };

  public get essFile(): EvacuationFileModel {
    return this.essFileValue;
  }
  public set essFile(value: EvacuationFileModel) {
    this.essFileValue = value;
  }

  getPossibleProfileMatchesCombinedData(
    firstName: string,
    lastName: string,
    dateOfBirth: string
  ): Observable<LinkedRegistrantProfileResults> {
    return new BehaviorSubject<LinkedRegistrantProfileResults>(
      this.possibleProfileMatches
    );
  }
}
