import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HouseholdMemberType } from 'src/app/core/api/models';
import { RegistrantProfileModel } from 'src/app/core/models/registrant-profile.model';
import { WizardType } from 'src/app/core/models/wizard-type.model';
import { EssFileService } from 'src/app/core/services/ess-file.service';
import { EvacueeProfileService } from 'src/app/core/services/evacuee-profile.service';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
import { EvacueeSearchService } from '../search/evacuee-search/evacuee-search.service';
import { StepEssFileService } from './step-ess-file/step-ess-file.service';
import { StepEvacueeProfileService } from './step-evacuee-profile/step-evacuee-profile.service';
import { ReferralCreationService } from './step-supports/referral-creation.service';
import { WizardDataService } from './wizard-data.service';
import { WizardService } from './wizard.service';
import * as globalConst from '../../core/services/global-constants';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { AppBaseService } from 'src/app/core/services/helper/appBase.service';
import { ComputeRulesService } from 'src/app/core/services/computeRules.service';
import { StepSupportsService } from './step-supports/step-supports.service';

@Injectable({
  providedIn: 'root'
})
export class WizardAdapterService {
  constructor(
    private wizardService: WizardService,
    private wizardDataService: WizardDataService,
    private evacueeSearchService: EvacueeSearchService,
    private evacueeSessionService: EvacueeSessionService,
    private evacueeProfileService: EvacueeProfileService,
    private essFileService: EssFileService,
    private stepEvacueeProfileService: StepEvacueeProfileService,
    private stepEssFileService: StepEssFileService,
    private referralCreation: ReferralCreationService,
    private alertService: AlertService,
    private appBaseService: AppBaseService,
    private computeState: ComputeRulesService,
    private stepSupportsService: StepSupportsService
  ) {}

  /**
   * Clear all steps for current wizard type, usually before exiting wizard
   */
  public clearWizard(): void {
    const wizType = this.appBaseService?.wizardProperties?.wizardType;

    switch (wizType) {
      case WizardType.NewRegistration:
        this.stepEvacueeProfileService.clearService();
        this.stepEssFileService.clearService();
        this.referralCreation.clearDraftSupport();
        return;

      case WizardType.EditRegistration:
        this.stepEvacueeProfileService.clearService();
        this.stepEssFileService.clearService();
        this.referralCreation.clearDraftSupport();
        return;

      case WizardType.NewEssFile:
        this.stepEssFileService.clearService();
        this.referralCreation.clearDraftSupport();
        return;

      case WizardType.MemberRegistration:
        this.stepEvacueeProfileService.clearService();
        this.stepEssFileService.clearService();
        this.referralCreation.clearDraftSupport();
        return;

      case WizardType.ReviewFile:
        this.stepEssFileService.clearService();
        this.referralCreation.clearDraftSupport();
        return;

      case WizardType.CompleteFile:
        this.stepEssFileService.clearService();
        this.referralCreation.clearDraftSupport();
        return;

      case WizardType.ExtendSupports:
        this.referralCreation.clearDraftSupport();
        return;
    }
  }

  /**
   * Set initial values for Create Registrant Profile (stepEvacueeProfileService) when entering from Evacuee Search
   */
  public stepCreateProfileFromSearch() {
    this.stepEvacueeProfileService.personalDetails = {
      ...this.stepEvacueeProfileService.personalDetails,
      firstName:
        this.evacueeSearchService.evacueeSearchContext?.evacueeSearchParameters
          .firstName,
      lastName:
        this.evacueeSearchService.evacueeSearchContext?.evacueeSearchParameters
          .lastName,
      dateOfBirth:
        this.evacueeSearchService.evacueeSearchContext?.evacueeSearchParameters
          .dateOfBirth
    };

    this.stepEvacueeProfileService.profileTabs =
      this.wizardDataService.createNewProfileSteps();
  }

  public stepCreateProfileForMembers() {
    this.stepEvacueeProfileService.personalDetails = {
      ...this.stepEvacueeProfileService.personalDetails,
      firstName: this.evacueeSessionService.memberRegistration.firstName,
      lastName: this.evacueeSessionService.memberRegistration.lastName,
      dateOfBirth: this.evacueeSessionService.memberRegistration.dateOfBirth,
      initials: this.evacueeSessionService.memberRegistration.initials,
      gender: this.evacueeSessionService.memberRegistration.gender
    };
    this.stepEvacueeProfileService.profileTabs =
      this.wizardDataService.createNewProfileSteps();
    this.stepEvacueeProfileService.setMemberProfileTabStatus();
  }

  /**
   * Set initial values for Edit Registrant Profile (stepProfileService), from an Evacuee Profile ID
   */
  public stepEditProfileFromProfileId(profileId: string): Observable<boolean> {
    return new Observable<boolean>((obs) => {
      this.evacueeProfileService.getProfileFromId(profileId).subscribe({
        next: (registrantProfileModel: RegistrantProfileModel) => {
          this.stepEvacueeProfileService.setFormValuesFromProfile(
            registrantProfileModel
          );

          this.stepEvacueeProfileService.profileTabs =
            this.wizardDataService.createNewEditProfileSteps();
          this.stepEvacueeProfileService.setEditProfileTabStatus();

          obs.next(true);
        },
        error: (error) => {
          obs.next(false);
          this.alertService.clearAlert();
          this.alertService.setAlert('danger', globalConst.getProfileError);
        }
      });
    });
  }

  /**
   * Set initial values for Create ESS File (stepEssFileService), from an Evacuee Profile ID
   */
  public stepCreateEssFileFromProfileId(
    profileId: string
  ): Observable<boolean> {
    return new Observable<boolean>((obs) => {
      this.evacueeProfileService.getProfileFromId(profileId).subscribe({
        next: (registrantProfileModel) => {
          this.stepCreateEssFileFromProfileRecord(registrantProfileModel);
          obs.next(true);
        },
        error: (error) => {
          obs.next(false);
          this.alertService.clearAlert();
          this.alertService.setAlert('danger', globalConst.getProfileError);
        }
      });
    });
  }

  /**
   * Set initial values for Create ESS File (stepEssFileService), from a full Evacuee Profile record
   */
  public stepCreateEssFileFromProfileRecord(profile: RegistrantProfileModel) {
    this.stepEssFileService.essTabs =
      this.wizardDataService.createNewESSFileSteps();

    this.appBaseService.appModel = {
      selectedProfile: { selectedEvacueeInContext: profile }
    };
    this.computeState.triggerEvent();

    this.stepEssFileService.primaryAddress =
      this.wizardService.setAddressObjectForForm(profile.primaryAddress);

    this.stepEssFileService.householdMembers = [
      {
        dateOfBirth: profile.personalDetails.dateOfBirth,
        firstName: profile.personalDetails.firstName,
        lastName: profile.personalDetails.lastName,
        gender: profile.personalDetails.gender,
        initials: profile.personalDetails.initials,
        sameLastName: true,
        householdMemberFromDatabase: true,
        isPrimaryRegistrant: true,
        type: HouseholdMemberType.Registrant
      }
    ];
  }

  public stepCreateEssFileFromEditProfileRecord(
    profile: RegistrantProfileModel
  ) {
    this.appBaseService.appModel = {
      selectedProfile: { selectedEvacueeInContext: profile }
    };
    this.computeState.triggerEvent();

    this.stepEssFileService.primaryAddress =
      this.wizardService.setAddressObjectForForm(profile.primaryAddress);

    const mainMember = this.stepEssFileService.householdMembers.find(
      (member) => member.type === HouseholdMemberType.Registrant
    );
    const index = this.stepEssFileService.householdMembers.indexOf(mainMember);

    const updatedMainMember = {
      ...mainMember,
      gender: profile.personalDetails.gender,
      initials: profile.personalDetails.initials
    };
    this.stepEssFileService.householdMembers[index] = updatedMainMember;
  }

  public stepReviewESSFileFromESSFileRecord(): Observable<boolean> {
    return new Observable<boolean>((obs) => {
      this.essFileService
        .getFileFromId(this.appBaseService?.appModel?.selectedEssFile?.id)
        .subscribe({
          next: (evacuationFileModel) => {
            this.stepEssFileService.needsAssessmentSubmitFlag = true;
            this.stepEssFileService.setFormValuesFromFile(evacuationFileModel);
            this.stepEssFileService.essTabs =
              this.wizardDataService.createNewESSFileSteps();
            this.stepEssFileService.setReviewEssFileTabStatus();
            this.stepEssFileService.selectedHouseholdMembers = [];
            this.stepSupportsService.setExistingSupportList(
              evacuationFileModel.supports
            );
            obs.next(true);
          },
          error: (error) => {
            obs.next(false);
            this.alertService.clearAlert();
            this.alertService.setAlert('danger', globalConst.getEssFileError);
          }
        });
    });
  }

  public stepCompleteESSFileFromESSFileRecord(): Observable<boolean> {
    return new Observable<boolean>((obs) => {
      this.essFileService
        .getFileFromId(this.appBaseService?.appModel?.selectedEssFile?.id)
        .subscribe({
          next: (evacuationFileModel) => {
            this.stepEssFileService.needsAssessmentSubmitFlag = true;
            this.stepEssFileService.setFormValuesFromFile(evacuationFileModel);
            this.stepEssFileService.essTabs =
              this.wizardDataService.createNewESSFileSteps();
            this.stepEssFileService.setCompleteEssFileTabStatus();
            this.stepEssFileService.selectedHouseholdMembers = [];
            this.stepSupportsService.setExistingSupportList(
              evacuationFileModel.supports
            );
            obs.next(true);
          },
          error: (error) => {
            obs.next(false);
            this.alertService.clearAlert();
            this.alertService.setAlert('danger', globalConst.getEssFileError);
          }
        });
    });
  }

  public stepExtendSupportsFromESSFileRecord(): Observable<boolean> {
    return new Observable<boolean>((obs) => {
      this.essFileService
        .getFileFromId(this.appBaseService?.appModel?.selectedEssFile?.id)
        .subscribe({
          next: (evacuationFileModel) => {
            this.stepEssFileService.setFormValuesFromFile(evacuationFileModel);
            this.stepSupportsService.setExistingSupportList(
              evacuationFileModel.supports
            );
            obs.next(true);
          },
          error: (error) => {
            obs.next(false);
            this.alertService.clearAlert();
            this.alertService.setAlert('danger', globalConst.getEssFileError);
          }
        });
    });
  }
}
