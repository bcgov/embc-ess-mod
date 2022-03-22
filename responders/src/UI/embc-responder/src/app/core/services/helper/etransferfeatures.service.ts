import { Injectable } from '@angular/core';
import { Code } from '../../api/models';
import {
  EtransferContent,
  EtransferRequirementStatus,
  ETransferStatus
} from '../../models/appBase.model';
import { RegistrantProfileModel } from '../../models/registrant-profile.model';
import { CacheService } from '../cache.service';
import { AppBaseService } from './appBase.service';

@Injectable({
  providedIn: 'root'
})
export class EtransferFeaturesService extends AppBaseService {
  public static etransferRequirementDefault?: EtransferRequirementStatus[] = [
    { statement: EtransferContent.bcServicesCard, status: false },
    { statement: EtransferContent.isNotMinor, status: false },
    { statement: EtransferContent.acceptTransfer, status: true },
    { statement: EtransferContent.window, status: true }
  ];

  private isRegistrantEtransferEligibleVal?: boolean;
  private etransferStatusVal?: ETransferStatus;
  private selectedSupportVal?: Code; //temp
  private interacAllowedVal?: boolean = true; //will come from backend
  private selectedEvacueeInContextVal?: RegistrantProfileModel; //temporary placeholder

  private etransferRequirementVal?: Array<EtransferRequirementStatus>;

  constructor(public cacheService: CacheService) {
    super(cacheService);
  }

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
