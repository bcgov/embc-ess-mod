import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { RegistrantProfile } from '../core/api/models';
import { EvacuationFileModel } from '../core/models/evacuation-file.model';
import { EssfileDashboardService } from '../feature-components/search/essfile-dashboard/essfile-dashboard.service';

@Injectable({
  providedIn: 'root'
})
export class MockEssfileDashboardService extends EssfileDashboardService {
  public essFileValue: EvacuationFileModel;
  public possibleProfileMatches: RegistrantProfile[] = [];

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
  ): Observable<RegistrantProfile[]> {
    return new BehaviorSubject<RegistrantProfile[]>(
      this.possibleProfileMatches
    );
  }
}
