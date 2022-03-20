import { Injectable } from '@angular/core';
import { AppBaseModel, ETransferStatus } from '../../models/appBase.model';
import { RegistrantProfileModel } from '../../models/registrant-profile.model';

@Injectable({
  providedIn: 'root'
})
export class FeaturesService extends AppBaseModel {
  private isRegistrantEtransferEligibleVal?: boolean;
  private etransferStatusVal?: ETransferStatus;
  private selectedSupportVal?: string;
  private interacAllowedVal?: boolean; //will come from backend
  private selectedEvacueeInContextVal?: RegistrantProfileModel; //temporary placeholder

  public set isRegistrantEtransferEligible(value: boolean) {
    this.isRegistrantEtransferEligibleVal = value;
  }

  public get isRegistrantEtransferEligible(): boolean {
    return this.isRegistrantEtransferEligibleVal;
  }

  public get etransferStatus(): ETransferStatus {
    return this.etransferStatusVal;
  }

  public set etransferStatus(value: ETransferStatus) {
    this.etransferStatusVal = value;
  }

  public get selectedSupport(): string {
    return this.selectedSupportVal;
  }

  public set selectedSupport(value: string) {
    this.selectedSupportVal = value;
  }

  public set interacAllowed(value: boolean) {
    this.interacAllowedVal = value;
  }

  public get interacAllowed(): boolean {
    return this.interacAllowedVal;
  }

  public get selectedEvacueeInContext(): RegistrantProfileModel {
    return this.selectedEvacueeInContextVal;
  }
  public set selectedEvacueeInContext(value: RegistrantProfileModel) {
    this.selectedEvacueeInContextVal = value;
  }
}
