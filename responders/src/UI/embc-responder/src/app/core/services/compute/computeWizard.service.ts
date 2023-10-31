import { Injectable } from '@angular/core';
import {
  WizardExitMap,
  WizardSteps,
  WizardType
} from '../../models/wizard-type.model';
import { AppBaseService } from '../helper/appBase.service';
import { Compute } from '../../interfaces/compute';
import * as globalConst from '../global-constants';
import { WizardDataService } from 'src/app/feature-components/wizard/wizard-data.service';

@Injectable()
export class ComputeWizardService implements Compute {
  constructor(
    private appBaseService: AppBaseService,
    private wizardDataService: WizardDataService
  ) {}

  execute() {
    this.calculateExitLink();
    this.calculateEvacueeTipText();
    this.calculateMemberTipText();
    this.loadDefaultMenuItems();
    this.triggerCaching();
  }

  triggerCaching() {
    this.appBaseService.setCache();
  }

  calculateExitLink() {
    if (
      this.appBaseService?.wizardProperties?.wizardType ===
      WizardType.EditRegistration
    ) {
      this.appBaseService.wizardProperties = {
        exitLink: WizardExitMap.ProfileDashboard
      };
    } else if (
      this.appBaseService?.wizardProperties?.wizardType ===
        WizardType.MemberRegistration ||
      this.appBaseService?.wizardProperties?.wizardType ===
        WizardType.ReviewFile ||
      this.appBaseService?.wizardProperties?.wizardType ===
        WizardType.CompleteFile ||
      this.appBaseService?.wizardProperties?.wizardType ===
        WizardType.ExtendSupports ||
      this.appBaseService?.wizardProperties?.wizardType === WizardType.CaseNotes
    ) {
      this.appBaseService.wizardProperties = {
        exitLink: WizardExitMap.FileDashoard
      };
    } else if (
      this.appBaseService?.wizardProperties?.wizardType ===
      WizardType.NewRegistration
    ) {
      if (this.appBaseService?.wizardProperties?.lastCompletedStep === null) {
        this.appBaseService.wizardProperties = {
          exitLink: WizardExitMap.SearchPage
        };
      } else if (
        this.appBaseService?.wizardProperties?.lastCompletedStep ===
        WizardSteps.Step1
      ) {
        this.appBaseService.wizardProperties = {
          exitLink: WizardExitMap.ProfileDashboard
        };
      } else if (
        this.appBaseService?.wizardProperties?.lastCompletedStep ===
        WizardSteps.Step2
      ) {
        this.appBaseService.wizardProperties = {
          exitLink: WizardExitMap.FileDashoard
        };
      }
    } else if (
      this.appBaseService?.wizardProperties?.wizardType ===
      WizardType.NewEssFile
    ) {
      if (this.appBaseService?.wizardProperties?.lastCompletedStep === null) {
        this.appBaseService.wizardProperties = {
          exitLink: WizardExitMap.ProfileDashboard
        };
      } else if (
        this.appBaseService?.wizardProperties?.lastCompletedStep ===
        WizardSteps.Step2
      ) {
        this.appBaseService.wizardProperties = {
          exitLink: WizardExitMap.FileDashoard
        };
      }
    }
  }

  calculateEvacueeTipText() {
    if (
      this.appBaseService?.wizardProperties?.wizardType ===
      WizardType.NewRegistration
    ) {
      this.appBaseService.wizardProperties = {
        evacueeDetailTipText: globalConst.newRegistrationTipText
      };
    } else if (
      this.appBaseService?.wizardProperties?.wizardType !==
        WizardType.NewRegistration &&
      this.appBaseService?.wizardProperties?.wizardType !==
        WizardType.MemberRegistration
    ) {
      this.appBaseService.wizardProperties = {
        evacueeDetailTipText: globalConst.otherRegistrationTipText
      };
    }
  }

  calculateMemberTipText() {
    if (
      this.appBaseService?.wizardProperties?.wizardType ===
      WizardType.ReviewFile
    ) {
      this.appBaseService.wizardProperties = {
        memberTipText: globalConst.reviewMembersTipText
      };
    } else if (
      this.appBaseService?.wizardProperties?.wizardType ===
      WizardType.CompleteFile
    ) {
      this.appBaseService.wizardProperties = {
        memberTipText: globalConst.completeMembersTipText
      };
    }
  }

  loadDefaultMenuItems() {
    if (
      this.appBaseService?.wizardProperties?.wizardType ===
      WizardType.NewRegistration
    ) {
      this.appBaseService.wizardProperties = {
        wizardMenu: this.wizardDataService.createNewRegistrationMenu()
      };
    } else if (
      this.appBaseService?.wizardProperties?.wizardType ===
      WizardType.NewEssFile
    ) {
      this.appBaseService.wizardProperties = {
        wizardMenu: this.wizardDataService.createNewESSFileMenu()
      };
    } else if (
      this.appBaseService?.wizardProperties?.wizardType ===
      WizardType.EditRegistration
    ) {
      this.appBaseService.wizardProperties = {
        wizardMenu: this.wizardDataService.createEditProfileMenu()
      };
    } else if (
      this.appBaseService?.wizardProperties?.wizardType ===
      WizardType.ReviewFile
    ) {
      this.appBaseService.wizardProperties = {
        wizardMenu: this.wizardDataService.createReviewFileMenu()
      };
    } else if (
      this.appBaseService?.wizardProperties?.wizardType ===
      WizardType.CompleteFile
    ) {
      this.appBaseService.wizardProperties = {
        wizardMenu: this.wizardDataService.createCompleteFileMenu()
      };
    } else if (
      this.appBaseService?.wizardProperties?.wizardType ===
      WizardType.MemberRegistration
    ) {
      this.appBaseService.wizardProperties = {
        wizardMenu: this.wizardDataService.createMembersProfileMenu()
      };
    } else if (
      this.appBaseService?.wizardProperties?.wizardType ===
      WizardType.ExtendSupports
    ) {
      this.appBaseService.wizardProperties = {
        wizardMenu: this.wizardDataService.createExtendSupportsMenu()
      };
    } else if (
      this.appBaseService?.wizardProperties?.wizardType === WizardType.CaseNotes
    ) {
      this.appBaseService.wizardProperties = {
        wizardMenu: this.wizardDataService.createCaseNotesMenu()
      };
    }
  }
}
