import { Injectable } from '@angular/core';
import { SupportSubCategory } from '../../api/models';
import {
  SelectedPathType,
  ETransferStatus,
  EtransferRequirementStatus,
  EtransferContent
} from '../../models/appBase.model';
import { ComputeRulesService } from '../computeRules.service';
import { EtransferFeaturesService } from './etransferfeatures.service';

@Injectable({
  providedIn: 'root'
})
export class ComputeFeaturesService {
  constructor(private featuresService: EtransferFeaturesService) {}

  execute() {
    this.computeEtransferStatus();
    this.computeEtransferEligibility();
    this.computeEtransferRequirementContent();
    console.log(this.featuresService);
  }

  private computeEtransferEligibility() {
    this.featuresService.isRegistrantEtransferEligible =
      !this.featuresService?.selectedEvacueeInContext?.isMinor &&
      this.featuresService?.selectedEvacueeInContext?.authenticatedUser;
  }

  private computeEtransferStatus() {
    if (
      this.featuresService?.selectedUserPathway ===
        SelectedPathType.PaperBased ||
      !this.featuresService.interacAllowed
    ) {
      this.featuresService.etransferStatus = ETransferStatus.Unavailable;
    } else if (
      this.featuresService?.selectedSupport?.value ===
        SupportSubCategory.Lodging_Hotel ||
      this.featuresService?.selectedSupport?.value ===
        SupportSubCategory.Lodging_Billeting ||
      this.featuresService?.selectedSupport?.value ===
        SupportSubCategory.Lodging_Group ||
      this.featuresService?.selectedSupport?.value ===
        SupportSubCategory.Transportation_Other ||
      this.featuresService?.selectedSupport?.value ===
        SupportSubCategory.Transportation_Taxi
    ) {
      this.featuresService.etransferStatus = ETransferStatus.NotAllowed;
    } else if (!this.featuresService?.isRegistrantEtransferEligible) {
      this.featuresService.etransferStatus = ETransferStatus.InEligible;
    } else {
      this.featuresService.etransferStatus = ETransferStatus.Available;
    }
  }

  private computeEtransferRequirementContent() {
    let requirementContent: Array<EtransferRequirementStatus> =
      new Array<EtransferRequirementStatus>();

    for (const defaultVal of EtransferFeaturesService.etransferRequirementDefault) {
      if (defaultVal.statement === EtransferContent.IsNotMinor) {
        requirementContent.push(
          Object.assign(new EtransferRequirementStatus(), {
            statement: EtransferContent.IsNotMinor,
            status: !this.featuresService?.selectedEvacueeInContext?.isMinor
          })
        );
      } else if (defaultVal.statement === EtransferContent.BCServicesCard) {
        requirementContent.push(
          Object.assign(new EtransferRequirementStatus(), {
            statement: EtransferContent.BCServicesCard,
            status:
              this.featuresService?.selectedEvacueeInContext?.authenticatedUser
          })
        );
      } else {
        requirementContent.push(
          Object.assign(new EtransferRequirementStatus(), defaultVal)
        );
      }
    }
    this.featuresService.etransferRequirement = requirementContent;
  }
}
