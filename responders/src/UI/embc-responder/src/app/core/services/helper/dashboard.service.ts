import { Injectable } from '@angular/core';
import { EvacuationFileStatus } from '../../api/models';
import { SelectedPathType } from '../../models/appBase.model';
import { DashboardBanner } from '../../models/dialog-content.model';
import { AppBaseService } from './appBase.service';
import * as globalConst from '../global-constants';
import { lastValueFrom, tap } from 'rxjs';
import { EssFileService } from '../ess-file.service';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { RegistrantProfileModel } from '../../models/registrant-profile.model';
import { EvacueeProfileService } from '../evacuee-profile.service';
import { EvacuationFileModel } from '../../models/evacuation-file.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(
    public appBaseService: AppBaseService,
    public essFileService: EssFileService,
    public alertService: AlertService,
    public evacueeProfileService: EvacueeProfileService
  ) {}

  getDashboardText(fileStatus: string): DashboardBanner {
    switch (fileStatus) {
      case EvacuationFileStatus.Active:
        return this.getActiveStatusText();
      case EvacuationFileStatus.Pending:
        return this.getPendingStatusText();
      case EvacuationFileStatus.Completed:
        return this.getCompletedStatusText();
      case EvacuationFileStatus.Expired:
        return this.getExpiredStatusText();
      default:
        return;
    }
  }

  getActiveStatusText(): DashboardBanner {
    const optionType = this.appBaseService?.appModel?.selectedUserPathway;
    if (optionType === SelectedPathType.remoteExtensions) {
      return globalConst.remoteActiveStatusText;
    } else if (optionType === SelectedPathType.caseNotes) {
      return globalConst.caseNotesActiveText;
    }
    return globalConst.activeStatusText;
  }

  getPendingStatusText(): DashboardBanner {
    return globalConst.pendingStatusText;
  }

  getCompletedStatusText(): DashboardBanner {
    const optionType = this.appBaseService?.appModel?.selectedUserPathway;
    if (optionType === SelectedPathType.paperBased) {
      return globalConst.paperCompletedStatusText;
    } else if (optionType === SelectedPathType.caseNotes) {
      return globalConst.caseNotesCompleteText;
    }
    return globalConst.completedStatusText;
  }

  getExpiredStatusText(): DashboardBanner {
    return globalConst.expiredStatusText;
  }

  async getEssFile(): Promise<EvacuationFileModel> {
    const file$ = this.essFileService
      .getFileFromId(this.appBaseService?.appModel?.selectedEssFile?.id)
      .pipe(
        tap({
          next: (result: EvacuationFileModel) => {},
          error: (error) => {
            this.alertService.clearAlert();
            this.alertService.setAlert(
              'danger',
              globalConst.fileDashboardError
            );
          }
        })
      );
    return lastValueFrom(file$);
  }

  public getEvacueeProfile(
    evacueeProfileId: string
  ): Promise<RegistrantProfileModel> {
    const profile$ = this.evacueeProfileService
      .getProfileFromId(evacueeProfileId)
      .pipe(
        tap({
          next: (profile: RegistrantProfileModel) => {},
          error: (error) => {
            this.alertService.clearAlert();
            this.alertService.setAlert('danger', globalConst.getProfileError);
          }
        })
      );
    return lastValueFrom(profile$);
  }
}
