import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { RegistrantProfileSearchResult } from '../core/api/models';
import { EvacuationFileModel } from '../core/models/evacuation-file.model';
import { EssfileDashboardService } from '../feature-components/search/essfile-dashboard/essfile-dashboard.service';

@Injectable({
  providedIn: 'root'
})
export class MockEssfileDashboardService extends EssfileDashboardService {
  public essFileValue: EvacuationFileModel;
  public possibleProfileMatches: RegistrantProfileSearchResult[] = [];

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
  ): Observable<RegistrantProfileSearchResult[]> {
    return new BehaviorSubject<RegistrantProfileSearchResult[]>(
      this.possibleProfileMatches
    );
  }
}
