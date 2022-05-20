import { Injectable } from '@angular/core';
import { EvacuationFileHouseholdMember } from 'src/app/core/api/models';
import { RegistrantProfileModel } from 'src/app/core/models/registrant-profile.model';
import { ComputeRulesService } from 'src/app/core/services/computeRules.service';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
import { AppBaseService } from 'src/app/core/services/helper/appBase.service';

@Injectable({ providedIn: 'root' })
export class PossibleMatchedEssfilesService {
  constructor(
    private appBaseService: AppBaseService,
    private computeState: ComputeRulesService,
    private evacueeSessionService: EvacueeSessionService
  ) {}

  public setLinkMetaData(
    fileId: string,
    householdMemberId: string,
    evacueeId: string
  ) {
    this.setSelectedFile(fileId);
    this.evacueeSessionService.fileLinkFlag = 'Y';
    this.evacueeSessionService.securityPhraseOpenedFrom =
      'responder-access/search/evacuee-profile-dashboard';
    this.evacueeSessionService.fileLinkMetaData = {
      fileId,
      linkRequest: {
        householdMemberId,
        registantId: evacueeId
      }
    };
  }

  public setSelectedFile(fileId: string) {
    this.appBaseService.appModel.selectedEssFile = {
      id: fileId,
      evacuatedFromAddress: null,
      needsAssessment: null,
      primaryRegistrantId: null,
      registrationLocation: null,
      task: null
    };

    this.computeState.triggerEvent();
  }

  public getRegistrantIdToLink(
    householdMembers: Array<EvacuationFileHouseholdMember>,
    evacueeProfile: RegistrantProfileModel
  ): string {
    for (const member of householdMembers) {
      if (
        member.firstName.toLocaleLowerCase() ===
          evacueeProfile.personalDetails.firstName.toLocaleLowerCase() &&
        member.lastName.toLocaleLowerCase() ===
          evacueeProfile.personalDetails.lastName.toLocaleLowerCase() &&
        member.dateOfBirth === evacueeProfile.personalDetails.dateOfBirth
      ) {
        return member.id;
      }
    }
    return null;
  }
}
