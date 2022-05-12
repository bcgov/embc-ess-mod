import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { Router } from '@angular/router';
import {
  EvacuationFileHouseholdMember,
  HouseholdMemberType,
  RegistrantProfileSearchResult
} from 'src/app/core/api/models';
import { EvacuationFileModel } from 'src/app/core/models/evacuation-file.model';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { FileDashboardVerifyDialogComponent } from 'src/app/shared/components/dialog-components/file-dashboard-verify-dialog/file-dashboard-verify-dialog.component';
import { RegistrantLinkDialogComponent } from 'src/app/shared/components/dialog-components/registrant-link-dialog/registrant-link-dialog.component';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import * as globalConst from '../../../../core/services/global-constants';
import { EssfileDashboardService } from '../essfile-dashboard.service';
import { MultipleLinkRegistrantModel } from 'src/app/core/models/multipleLinkRegistrant.model';
import { WizardType } from 'src/app/core/models/wizard-type.model';
import { AppBaseService } from 'src/app/core/services/helper/appBase.service';
import { ComputeRulesService } from 'src/app/core/services/computeRules.service';
import { SelectedPathType } from 'src/app/core/models/appBase.model';

@Component({
  selector: 'app-household-member',
  templateUrl: './household-member.component.html',
  styleUrls: ['./household-member.component.scss']
})
export class HouseholdMemberComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  @Input() essFile: EvacuationFileModel;
  currentlyOpenedItemIndex = -1;
  registrantId: string;
  isLoading = false;
  public color = '#169BD5';

  constructor(
    public essfileDashboardService: EssfileDashboardService,
    private dialog: MatDialog,
    private alertService: AlertService,
    private router: Router,
    private evacueeSessionService: EvacueeSessionService,
    private appBaseService: AppBaseService,
    private computeState: ComputeRulesService
  ) {}

  ngOnInit(): void {}

  /**
   * Sets expanded input value for panel
   *
   * @param index
   * @returns
   */
  isExpanded(index: number): boolean {
    return index === 0;
  }

  /**
   * Updates value of openend file index
   *
   * @param itemIndex selected file index
   */
  setOpened(
    itemIndex: number,
    houseHoldMember: EvacuationFileHouseholdMember
  ): void {
    this.currentlyOpenedItemIndex = itemIndex;
    this.essfileDashboardService.matchedProfiles = undefined;
    this.essfileDashboardService.displayMemberButton = undefined;
    this.essfileDashboardService.selectedMember = houseHoldMember;

    this.isLoading = !this.isLoading;

    if (
      houseHoldMember.type === HouseholdMemberType.HouseholdMember &&
      this.appBaseService.appModel.selectedUserPathway ===
        SelectedPathType.digital &&
      !houseHoldMember.isMinor &&
      houseHoldMember.linkedRegistrantId === null
    ) {
      this.essfileDashboardService
        .getPossibleProfileMatches(
          houseHoldMember.firstName,
          houseHoldMember.lastName,
          houseHoldMember.dateOfBirth
        )
        .subscribe({
          next: (value: RegistrantProfileSearchResult[]) => {
            this.essfileDashboardService.matchedProfiles = value;
            this.essfileDashboardService.maphouseholdMemberDisplayButton();
            this.isLoading = !this.isLoading;
          },
          error: (error) => {
            this.isLoading = !this.isLoading;
            this.alertService.clearAlert();
            this.alertService.setAlert('danger', globalConst.genericError);
          }
        });
    } else {
      this.essfileDashboardService.maphouseholdMemberDisplayButton();
      this.isLoading = !this.isLoading;
    }
  }

  /**
   * Resets the opened file index to default
   *
   * @param itemIndex closed file index
   */
  setClosed(itemIndex: number): void {
    if (this.currentlyOpenedItemIndex === itemIndex) {
      this.currentlyOpenedItemIndex = -1;
    }
  }

  viewProfile(memberDetails: EvacuationFileHouseholdMember) {
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

  createProfile(memberDetails: EvacuationFileHouseholdMember) {
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

  linkToProfile(memberDetails: EvacuationFileHouseholdMember) {
    if (this.essfileDashboardService.matchedProfiles.length === 1) {
      this.evacueeSessionService.fileLinkFlag = 'Y';
      this.singleMatchedRegistrantLink(memberDetails);
    } else if (this.essfileDashboardService.matchedProfiles.length > 1) {
      this.multipleMatchedRegistrantLink(
        this.createMultipleRegistrantModel(memberDetails)
      );
    }
  }

  private createMultipleRegistrantModel(
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

  /**
   * Sorts array based on authentication indicator
   *
   * @param matchedProfiles profile array
   * @returns sorted array
   */
  private sortByAuthenticationFactor(
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
  private sortByVerificationFactor(
    matchedProfiles: RegistrantProfileSearchResult[]
  ): RegistrantProfileSearchResult[] {
    return matchedProfiles.sort((a, b) =>
      a.status ? a.status.localeCompare(b.status) : -1
    );
  }

  /**
   * Create navigation for view profile
   *
   * @param value user selected value
   * @param memberDetails household member
   */
  private createNavigationForRegistrant(
    value: string,
    memberDetails: EvacuationFileHouseholdMember
  ) {
    if (value === 'Yes') {
      //this.evacueeSessionService.profileId = memberDetails.linkedRegistrantId;
      this.setProfileDetails(memberDetails.linkedRegistrantId);
      this.router.navigate([
        'responder-access/search/evacuee-profile-dashboard'
      ]);
    } else if (value === 'No') {
      //this.evacueeSessionService.profileId = memberDetails.linkedRegistrantId;
      this.setProfileDetails(memberDetails.linkedRegistrantId);
      this.evacueeSessionService.securityQuestionsOpenedFrom =
        'responder-access/search/essfile-dashboard';
      this.router.navigate(['responder-access/search/security-questions']);
    } else if (value === 'answered') {
      //this.evacueeSessionService.profileId = memberDetails.linkedRegistrantId;
      this.setProfileDetails(memberDetails.linkedRegistrantId);
      this.router.navigate([
        'responder-access/search/evacuee-profile-dashboard'
      ]);
    }
  }

  /**
   * Links members for single matched result
   *
   * @param memberDetails household member
   */
  private singleMatchedRegistrantLink(
    memberDetails: EvacuationFileHouseholdMember
  ): void {
    this.evacueeSessionService.securityQuestionsOpenedFrom =
      'responder-access/search/essfile-dashboard';
    this.evacueeSessionService.fileLinkMetaData = {
      fileId: this.essFile.id,
      linkRequest: {
        householdMemberId: memberDetails.id,
        registantId: this.essfileDashboardService.matchedProfiles[0].id
      }
    };
    this.setProfileDetails(this.essfileDashboardService.matchedProfiles[0].id);
    this.router.navigate(['responder-access/search/security-questions']);
  }

  private multipleMatchedRegistrantLink(
    multipleLinkRegistrants: MultipleLinkRegistrantModel
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
            this.evacueeSessionService.fileLinkFlag = 'Y';
            this.evacueeSessionService.securityQuestionsOpenedFrom =
              'responder-access/search/essfile-dashboard';
            this.evacueeSessionService.fileLinkMetaData = {
              fileId: this.essFile.id,
              linkRequest: {
                householdMemberId: multipleLinkRegistrants.householdMemberId,
                registantId: value
              }
            };
            //this.evacueeSessionService.profileId = value;
            this.setProfileDetails(value);
            this.router.navigate([
              'responder-access/search/security-questions'
            ]);
          }
        }
      });
  }

  private setProfileDetails(id: string) {
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
}
