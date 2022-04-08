import { Injectable } from '@angular/core';
import { SupportSubCategory } from '../../api/models';
import {
  SelectedPathType,
  ETransferStatus,
  EtransferRequirementStatus,
  EtransferContent
} from '../../models/appBase.model';
import { Compute } from './compute';
import { AppBaseService } from '../helper/appBase.service';

@Injectable()
export class ComputeFeaturesService implements Compute {
  constructor(private appBaseService: AppBaseService) {}

  execute() {
    this.computeEtransferStatus();
    this.computeEtransferEligibility();
    this.computeEtransferRequirementContent();
    this.triggerCaching();
    console.log(this.appBaseService);
  }

  triggerCaching() {
    this.appBaseService.setCache();
  }

  private computeEtransferEligibility() {
    this.appBaseService.appModel.etransferProperties.isRegistrantEtransferEligible =
      !this.appBaseService?.appModel?.selectedProfile?.selectedEvacueeInContext
        ?.isMinor &&
      this.appBaseService?.appModel?.selectedProfile?.selectedEvacueeInContext
        ?.authenticatedUser;
  }

  private computeEtransferStatus() {
    if (
      this.appBaseService?.appModel?.selectedUserPathway ===
        SelectedPathType.paperBased ||
      !this.appBaseService?.appModel?.etransferProperties?.interacAllowed
    ) {
      this.appBaseService.appModel.etransferProperties.etransferStatus =
        ETransferStatus.unavailable;
    } else if (
      this.appBaseService?.appModel?.supportProperties?.selectedSupport
        ?.value === SupportSubCategory.Lodging_Hotel ||
      this.appBaseService?.appModel?.supportProperties?.selectedSupport
        ?.value === SupportSubCategory.Lodging_Billeting ||
      this.appBaseService?.appModel?.supportProperties?.selectedSupport
        ?.value === SupportSubCategory.Lodging_Group ||
      this.appBaseService?.appModel?.supportProperties?.selectedSupport
        ?.value === SupportSubCategory.Transportation_Other ||
      this.appBaseService?.appModel?.supportProperties?.selectedSupport
        ?.value === SupportSubCategory.Transportation_Taxi
    ) {
      this.appBaseService.appModel.etransferProperties.etransferStatus =
        ETransferStatus.notAllowed;
    } else if (
      !this.appBaseService?.appModel?.etransferProperties
        ?.isRegistrantEtransferEligible
    ) {
      this.appBaseService.appModel.etransferProperties.etransferStatus =
        ETransferStatus.inEligible;
    } else {
      this.appBaseService.appModel.etransferProperties.etransferStatus =
        ETransferStatus.available;
    }
  }

  private computeEtransferRequirementContent() {
    const requirementContent: Array<EtransferRequirementStatus> =
      new Array<EtransferRequirementStatus>();

    for (const defaultVal of AppBaseService.etransferRequirementDefault) {
      if (defaultVal.statement === EtransferContent.isNotMinor) {
        requirementContent.push(
          Object.assign(new EtransferRequirementStatus(), {
            statement: EtransferContent.isNotMinor,
            status:
              !this.appBaseService?.appModel?.selectedProfile
                ?.selectedEvacueeInContext?.isMinor
          })
        );
      } else if (defaultVal.statement === EtransferContent.bcServicesCard) {
        requirementContent.push(
          Object.assign(new EtransferRequirementStatus(), {
            statement: EtransferContent.bcServicesCard,
            status:
              this.appBaseService?.appModel?.selectedProfile
                ?.selectedEvacueeInContext?.authenticatedUser
          })
        );
      } else {
        requirementContent.push(
          Object.assign(new EtransferRequirementStatus(), defaultVal)
        );
      }
    }
    this.appBaseService.appModel.etransferProperties.etransferRequirement =
      requirementContent;
  }
}
