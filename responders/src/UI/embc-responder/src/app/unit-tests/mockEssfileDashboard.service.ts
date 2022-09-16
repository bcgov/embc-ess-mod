import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { RegistrantProfileSearchResult } from '../core/api/models';
import { EvacuationFileModel } from '../core/models/evacuation-file.model';
import { EssfileDashboardService } from '../feature-components/search/essfile-dashboard/essfile-dashboard.service';
import * as globalConst from '../core/services/global-constants';

@Injectable({
  providedIn: 'root'
})
export class MockEssfileDashboardService extends EssfileDashboardService {
  fileLinkStatus: string;
  public essFileValue: EvacuationFileModel;
  public possibleProfileMatches: RegistrantProfileSearchResult[] = [];

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
  ): Observable<RegistrantProfileSearchResult[]> {
    return new BehaviorSubject<RegistrantProfileSearchResult[]>(
      this.possibleProfileMatches
    );
  }

  /**
   * Displays file linking dialog boxes
   */
  showFileLinkingPopups() {
    if (this.fileLinkStatus === 'S') {
      this.openLinkDialog(globalConst.profileLinkMessage)
        .afterClosed()
        .subscribe({
          next: (value) => {
            this.evacueeSessionService.fileLinkFlag = null;
            this.evacueeSessionService.fileLinkMetaData = null;
            this.evacueeSessionService.fileLinkStatus = null;
          }
        });
    } else if (this.fileLinkStatus === 'E') {
      this.openLinkDialog(globalConst.profileLinkErrorMessage)
        .afterClosed()
        .subscribe({
          next: (value) => {
            this.evacueeSessionService.fileLinkFlag = null;
            this.evacueeSessionService.fileLinkMetaData = null;
            this.evacueeSessionService.fileLinkStatus = null;
          }
        });
    }
  }
}
