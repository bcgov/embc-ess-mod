import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  EvacuationFileHouseholdMember,
  RegistrantProfileSearchResult
} from 'src/app/core/api/models';
import { EvacuationFileModel } from 'src/app/core/models/evacuation-file.model';
import { MultipleLinkRegistrantModel } from 'src/app/core/models/multipleLinkRegistrant.model';
import { ComputeRulesService } from 'src/app/core/services/computeRules.service';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
import { AppBaseService } from 'src/app/core/services/helper/appBase.service';
import { FileDashboardVerifyDialogComponent } from 'src/app/shared/components/dialog-components/file-dashboard-verify-dialog/file-dashboard-verify-dialog.component';
import { RegistrantLinkDialogComponent } from 'src/app/shared/components/dialog-components/registrant-link-dialog/registrant-link-dialog.component';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { EssfileDashboardService } from '../essfile-dashboard.service';
import * as globalConst from '../../../../core/services/global-constants';
import { WizardType } from 'src/app/core/models/wizard-type.model';

@Injectable({
  providedIn: 'root'
})
export class HouseholdMemberService {
  constructor(
    private router: Router,
    private evacueeSessionService: EvacueeSessionService,
    private appBaseService: AppBaseService,
    private computeState: ComputeRulesService,
    protected dialog: MatDialog,
    private essfileDashboardService: EssfileDashboardService
  ) {}

  /**
   * Create navigation for view profile
   *
   * @param value user selected value
   * @param memberDetails household member
   */
  public createNavigationForRegistrant(
    value: string,
    memberDetails: EvacuationFileHouseholdMember
  ) {
    if (value === 'Yes') {
      this.setProfileDetails(memberDetails.linkedRegistrantId);
      this.router.navigate([
        'responder-access/search/evacuee-profile-dashboard'
      ]);
    } else if (value === 'No') {
      this.setProfileDetails(memberDetails.linkedRegistrantId);
      this.evacueeSessionService.securityQuestionsOpenedFrom =
        'responder-access/search/essfile-dashboard';
      this.router.navigate(['responder-access/search/security-questions']);
    } else if (value === 'answered') {
      this.setProfileDetails(memberDetails.linkedRegistrantId);
      this.router.navigate([
        'responder-access/search/evacuee-profile-dashboard'
      ]);
    }
  }

  public setProfileDetails(id: string) {
    let profileModel =
      this.appBaseService?.appModel?.selectedProfile?.selectedEvacueeInContext;
    const profileReload =
      this.appBaseService?.appModel?.selectedProfile
        ?.selectedEvacueeInContext === null;

    if (profileModel === null) {
      profileModel = {
        id,
        primaryAddress: null,
        mailingAddress: null,
        personalDetails: null,
        contactDetails: null,
        restriction: null
      };
    }
    this.appBaseService.appModel = {
      selectedProfile: {
        selectedEvacueeInContext: profileModel,
        householdMemberRegistrantId: id,
        profileReloadFlag: profileReload
      }
    };
    this.computeState.triggerEvent();
  }

  public multipleMatchedRegistrantLink(
    multipleLinkRegistrants: MultipleLinkRegistrantModel,
    essFile: EvacuationFileModel
  ): void {
    this.dialog
      .open(DialogComponent, {
        data: {
          component: RegistrantLinkDialogComponent,
          profileData: multipleLinkRegistrants
        },
        width: '940px',
        height: '90%'
      })
      .afterClosed()
      .subscribe({
        next: (value) => {
          if (value !== 'close') {
            this.navigateForMultipleLink(
              essFile,
              multipleLinkRegistrants,
              value
            );
          }
        }
      });
  }

  navigateForMultipleLink(
    essFile: EvacuationFileModel,
    multipleLinkRegistrants: MultipleLinkRegistrantModel,
    value
  ) {
    this.evacueeSessionService.fileLinkFlag = 'Y';
    this.evacueeSessionService.securityQuestionsOpenedFrom =
      'responder-access/search/essfile-dashboard';
    this.evacueeSessionService.fileLinkMetaData = {
      fileId: essFile.id,
      linkRequest: {
        householdMemberId: multipleLinkRegistrants.householdMemberId,
        registantId: value
      }
    };
    this.setProfileDetails(value);
    this.router.navigate(['responder-access/search/security-questions']);
  }

  /**
   * Links members for single matched result
   *
   * @param memberDetails household member
   */
  public singleMatchedRegistrantLink(
    memberDetails: EvacuationFileHouseholdMember,
    essFile: EvacuationFileModel
  ): void {
    this.evacueeSessionService.securityQuestionsOpenedFrom =
      'responder-access/search/essfile-dashboard';
    this.evacueeSessionService.fileLinkMetaData = {
      fileId: essFile.id,
      linkRequest: {
        householdMemberId: memberDetails.id,
        registantId: this.essfileDashboardService.matchedProfiles[0].id
      }
    };
    this.setProfileDetails(this.essfileDashboardService.matchedProfiles[0].id);
    this.router.navigate(['responder-access/search/security-questions']);
  }

  /**
   * Sorts array based on authentication indicator
   *
   * @param matchedProfiles profile array
   * @returns sorted array
   */
  public sortByAuthenticationFactor(
    matchedProfiles: RegistrantProfileSearchResult[]
  ): RegistrantProfileSearchResult[] {
    return matchedProfiles.sort((a, b) =>
      a.isAuthenticated === b.isAuthenticated ? 0 : a.isAuthenticated ? -1 : 1
    );
  }

  /**
   * Sorts array based on user verification indicator
   *
   * @param matchedProfiles profile array
   * @returns sorted array
   */
  public sortByVerificationFactor(
    matchedProfiles: RegistrantProfileSearchResult[]
  ): RegistrantProfileSearchResult[] {
    return matchedProfiles.sort((a, b) =>
      a.status ? a.status.localeCompare(b.status) : -1
    );
  }

  public createMultipleRegistrantModel(
    memberDetails: EvacuationFileHouseholdMember
  ): MultipleLinkRegistrantModel {
    return {
      firstName: memberDetails.firstName,
      lastName: memberDetails.lastName,
      dateOfBirth: memberDetails.dateOfBirth,
      profiles: this.sortByVerificationFactor(
        this.sortByAuthenticationFactor(
          this.essfileDashboardService.matchedProfiles
        )
      ),
      householdMemberId: memberDetails.id
    };
  }

  public viewMemberProfile(memberDetails: EvacuationFileHouseholdMember) {
    this.dialog
      .open(DialogComponent, {
        data: {
          component: FileDashboardVerifyDialogComponent,
          content: globalConst.dashboardViewProfile,
          profileData: memberDetails
        },
        width: '720px'
      })
      .afterClosed()
      .subscribe({
        next: (value) => {
          this.createNavigationForRegistrant(value, memberDetails);
        }
      });
  }

  public createMemberProfile(memberDetails: EvacuationFileHouseholdMember) {
    this.evacueeSessionService.memberRegistration = memberDetails;

    this.appBaseService.wizardProperties = {
      wizardType: WizardType.MemberRegistration,
      lastCompletedStep: null,
      editFlag: false,
      memberFlag: true
    };
    this.computeState.triggerEvent();

    this.router.navigate(['/ess-wizard'], {
      queryParams: { type: WizardType.MemberRegistration },
      queryParamsHandling: 'merge'
    });
  }

  public linkMemberProfile(
    memberDetails: EvacuationFileHouseholdMember,
    essFile: EvacuationFileModel
  ) {
    if (this.essfileDashboardService.matchedProfiles.length === 1) {
      this.evacueeSessionService.fileLinkFlag = 'Y';
      this.singleMatchedRegistrantLink(memberDetails, essFile);
    } else if (this.essfileDashboardService.matchedProfiles.length > 1) {
      this.multipleMatchedRegistrantLink(
        this.createMultipleRegistrantModel(memberDetails),
        essFile
      );
    }
  }
}
