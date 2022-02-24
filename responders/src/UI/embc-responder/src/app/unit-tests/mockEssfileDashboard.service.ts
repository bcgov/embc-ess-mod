import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { RegistrantProfile } from '../core/api/models';
import { EvacuationFileModel } from '../core/models/evacuation-file.model';
import { LinkRegistrantProfileModel } from '../core/models/link-registrant-profile.model';
import { EssfileDashboardService } from '../feature-components/search/essfile-dashboard/essfile-dashboard.service';

@Injectable({
  providedIn: 'root'
})
export class MockEssfileDashboardService extends EssfileDashboardService {
  public essFileValue: EvacuationFileModel;
  public possibleProfileMatches: LinkRegistrantProfileModel[] = [];

  public get essFile(): EvacuationFileModel {
    return this.essFileValue;
  }
  public set essFile(value: EvacuationFileModel) {
    this.essFileValue = value;
  }

  getPossibleProfileMatches(
    firstName: string,
    lastName: string,
    dateOfBirth: string
  ): Observable<LinkRegistrantProfileModel[]> {
    return new BehaviorSubject<LinkRegistrantProfileModel[]>(
      this.possibleProfileMatches
    );
  }
}
