import { SupportSubCategory } from '../../api/models';
import { SelectedPathType, ETransferStatus } from '../../models/appBase.model';
import { ComputeRulesService } from '../computeRules.service';
import { FeaturesService } from './features.service';

export class ComputeFeatures {
  constructor(
    private computeState: ComputeRulesService,
    private featuresService: FeaturesService
  ) {}

  listener() {
    this.computeState.eventSubject$.subscribe({
      next: () => {
        this.computeEtransferStatus();
        console.log(this.featuresService);
      }
    });
  }

  private computeEtransferEligibility() {} //todo

  private computeEtransferStatus() {
    if (
      this.featuresService.selectedEvacueeInContext.isMinor ||
      this.featuresService.selectedUserPathway ===
        SelectedPathType.PaperBased ||
      !this.featuresService.interacAllowed
    ) {
      this.featuresService.etransferStatus = ETransferStatus.Unavailable;
    } else if (
      this.featuresService.selectedSupport ===
        SupportSubCategory.Lodging_Hotel ||
      this.featuresService.selectedSupport ===
        SupportSubCategory.Lodging_Billeting ||
      this.featuresService.selectedSupport ===
        SupportSubCategory.Lodging_Group ||
      this.featuresService.selectedSupport ===
        SupportSubCategory.Transportation_Other ||
      this.featuresService.selectedSupport ===
        SupportSubCategory.Transportation_Taxi
    ) {
      this.featuresService.etransferStatus = ETransferStatus.NotAllowed;
    } else if (!this.featuresService.isRegistrantEtransferEligible) {
      this.featuresService.etransferStatus = ETransferStatus.InEligible;
    } else {
      this.featuresService.etransferStatus = ETransferStatus.Available;
    }
  }
}
