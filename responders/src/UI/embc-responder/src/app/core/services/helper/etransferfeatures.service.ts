import { Injectable } from '@angular/core';
import { Code } from '../../api/models';
import {
  AppBaseModel,
  EtransferContent,
  EtransferRequirementStatus,
  ETransferStatus
} from '../../models/appBase.model';
import { RegistrantProfileModel } from '../../models/registrant-profile.model';

@Injectable({
  providedIn: 'root'
})
export class EtransferFeaturesService extends AppBaseModel {
  private isRegistrantEtransferEligibleVal?: boolean;
  private etransferStatusVal?: ETransferStatus;
  private selectedSupportVal?: Code; //temp
  private interacAllowedVal?: boolean = true; //will come from backend
  private selectedEvacueeInContextVal?: RegistrantProfileModel; //temporary placeholder

  private etransferRequirementVal?: Array<EtransferRequirementStatus>;

  public static etransferRequirementDefault?: EtransferRequirementStatus[] = [
    { statement: EtransferContent.BCServicesCard, status: false },
    { statement: EtransferContent.IsNotMinor, status: false },
    { statement: EtransferContent.AcceptTransfer, status: true },
    { statement: EtransferContent.Window, status: true }
  ];

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

  public get selectedSupport(): Code {
    return this.selectedSupportVal;
  }

  public set selectedSupport(value: Code) {
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

  public set etransferRequirement(value: Array<EtransferRequirementStatus>) {
    this.etransferRequirementVal = value;
  }

  public get etransferRequirement(): Array<EtransferRequirementStatus> {
    return this.etransferRequirementVal;
  }
}
