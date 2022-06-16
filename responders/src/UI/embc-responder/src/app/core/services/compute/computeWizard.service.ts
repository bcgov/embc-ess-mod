import { Injectable } from '@angular/core';
import {
  WizardExitMap,
  WizardSteps,
  WizardType
} from '../../models/wizard-type.model';
import { AppBaseService } from '../helper/appBase.service';
import { Compute } from './compute';
import * as globalConst from '../global-constants';

@Injectable()
export class ComputeWizardService implements Compute {
  constructor(private appBaseService: AppBaseService) {}

  execute() {
    this.calculateExitLink();
    this.calculateTipText();
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
        WizardType.CompleteFile
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

  calculateTipText() {
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
}
