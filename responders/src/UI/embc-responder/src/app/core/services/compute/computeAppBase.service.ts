import { Injectable } from '@angular/core';
import {
  DigitalFlow,
  PaperFlow,
  SelectedPathType
} from '../../models/appBase.model';
import { AppBaseService } from '../helper/appBase.service';
import { Compute } from './compute';
import * as globalConst from '../global-constants';

@Injectable()
export class ComputeAppBaseService implements Compute {
  constructor(private appBaseService: AppBaseService) {}

  execute() {
    if (
      this.appBaseService?.appModel?.selectedUserPathway ===
      SelectedPathType.digital
    ) {
      this.computeEvacueeDigitalSearchParams();
    } else if (
      this.appBaseService?.appModel?.selectedUserPathway ===
      SelectedPathType.paperBased
    ) {
      this.computeEvacueePaperSearchParams();
    }
    this.triggerCaching();
  }

  triggerCaching() {
    this.appBaseService.setCache();
  }

  private computeEvacueePaperSearchParams() {
    this.appBaseService.appModel = {
      evacueeSearchType: {
        idQuestion: globalConst.paperIdQuestion
      } as PaperFlow
    };
  }

  private computeEvacueeDigitalSearchParams() {
    this.appBaseService.appModel = {
      evacueeSearchType: {
        idQuestion: globalConst.digitalIdQuestion
      } as DigitalFlow
    };
  }
}
