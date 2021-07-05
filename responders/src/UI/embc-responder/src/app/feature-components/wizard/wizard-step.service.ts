import { Injectable } from '@angular/core';
import {
  HouseholdMemberType,
  RegistrantProfile
} from 'src/app/core/api/models';
import { RegistrantProfileModel } from 'src/app/core/models/registrant-profile.model';
import { CacheService } from 'src/app/core/services/cache.service';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
import { UserService } from 'src/app/core/services/user.service';
import { EvacueeSearchService } from '../search/evacuee-search/evacuee-search.service';
import { StepEssFileService } from './step-ess-file/step-ess-file.service';
import { StepEvacueeProfileService } from './step-evacuee-profile/step-evacuee-profile.service';
import { WizardService } from './wizard.service';

@Injectable({
  providedIn: 'root'
})
export class WizardStepService {
  constructor(
    private wizardService: WizardService,
    private userService: UserService,
    private cacheService: CacheService,
    private evacueeSearchService: EvacueeSearchService,
    private evacueeSessionService: EvacueeSessionService,
    private stepEvacueeProfileService: StepEvacueeProfileService,
    private stepEssFileService: StepEssFileService
  ) {}

  /**
   * Set initial values for stepEvacueeProfileService when entering from Evacuee Search
   */
  public evacueeProfileStepFromSearch() {
    this.stepEvacueeProfileService.personalDetails = {
      ...this.stepEvacueeProfileService.personalDetails,
      firstName: this.evacueeSearchService.evacueeSearchContext
        ?.evacueeSearchParameters?.firstName,
      lastName: this.evacueeSearchService.evacueeSearchContext
        ?.evacueeSearchParameters?.lastName,
      dateOfBirth: this.evacueeSearchService.evacueeSearchContext
        ?.evacueeSearchParameters?.dateOfBirth
    };
  }

  /**
   * Set initial values for stepEvacueeProfileService when entering from Evacuee Profile Dashboard
   */
  public evacueeProfileStepFromDashboard() {
    //TODO
  }

  /**
   * Set initial values for stepEssFileService after ceating new profile on wizard
   */
  public essFileStepFromProfileCreation(profile: RegistrantProfileModel) {
    this.evacueeSessionService.profileId = profile.id;
    this.stepEssFileService.primaryAddress = this.wizardService.setAddressObjectForForm(
      profile.primaryAddress
    );

    this.stepEssFileService.primaryMember = {
      dateOfBirth: profile.personalDetails.dateOfBirth,
      firstName: profile.personalDetails.firstName,
      lastName: profile.personalDetails.lastName,
      gender: profile.personalDetails.gender,
      initials: profile.personalDetails.initials,
      sameLastName: true,
      isPrimaryRegistrant: true,
      type: HouseholdMemberType.Registrant
    };
  }

  /**
   * Set initial values for stepEssFileService when entering from Evacuee Profile Dashboard
   */
  public essFileStepFromDashboard() {
    //TODO
  }
}
