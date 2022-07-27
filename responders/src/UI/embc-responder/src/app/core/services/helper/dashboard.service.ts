import { Injectable } from '@angular/core';
import { EvacuationFileStatus } from '../../api/models';
import { SelectedPathType } from '../../models/appBase.model';
import { DashboardBanner } from '../../models/dialog-content.model';
import { AppBaseService } from './appBase.service';
import * as globalConst from '../global-constants';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(public appBaseService: AppBaseService) {}

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
    let optionType = this.appBaseService?.appModel?.selectedUserPathway;
    if (optionType === SelectedPathType.remoteExtensions) {
      return globalConst.remoteActiveStatusText;
    }
    return globalConst.activeStatusText;
  }

  getPendingStatusText(): DashboardBanner {
    return globalConst.pendingStatusText;
  }

  getCompletedStatusText(): DashboardBanner {
    let optionType = this.appBaseService?.appModel?.selectedUserPathway;
    if (optionType === SelectedPathType.paperBased) {
      return globalConst.paperCompletedStatusText;
    }
    return globalConst.completedStatusText;
  }

  getExpiredStatusText(): DashboardBanner {
    return globalConst.expiredStatusText;
  }
}
