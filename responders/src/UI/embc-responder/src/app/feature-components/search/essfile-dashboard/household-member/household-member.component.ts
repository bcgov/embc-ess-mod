import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { Router } from '@angular/router';
import {
  EvacuationFileHouseholdMember,
  HouseholdMemberType,
  RegistrantProfile
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
import { RegistrantProfileModel } from 'src/app/core/models/registrant-profile.model';
import {
  RepositionScrollStrategy,
  ScrollStrategyOptions
} from '@angular/cdk/overlay';
import { FixedSizeVirtualScrollStrategy } from '@angular/cdk/scrolling';

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
  matchedProfileCount: number;
  matchedProfiles: RegistrantProfile[];
  linkedFlag = false;
  public color = '#169BD5';

  constructor(
    private dialog: MatDialog,
    private alertService: AlertService,
    private router: Router,
    private essfileDashboardService: EssfileDashboardService,
    private evacueeSessionService: EvacueeSessionService
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
    this.isLoading = !this.isLoading;
    if (houseHoldMember.type === HouseholdMemberType.HouseholdMember) {
      this.essfileDashboardService
        .getPossibleProfileMatches(
          houseHoldMember.firstName,
          houseHoldMember.lastName,
          houseHoldMember.dateOfBirth
        )
        .subscribe(
          (value) => {
            console.log(value);
            this.matchedProfileCount = value.length;
            this.matchedProfiles = value;
            if (value.length > 0) {
              this.linkedFlag = !this.linkedFlag;
            }
            this.isLoading = !this.isLoading;
          },
          (error) => {
            this.isLoading = !this.isLoading;
          }
        );
    } else {
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
          content: globalConst.dashboardViewProfile
        },
        height: '450px',
        width: '720px'
      })
      .afterClosed()
      .subscribe((value) => {
        this.createNavigationForRegistrant(value, memberDetails);
      });
  }

  createProfile(file) {}

  linkToProfile(memberDetails: EvacuationFileHouseholdMember) {
    if (this.matchedProfileCount === 1) {
      this.evacueeSessionService.fileLinkFlag = 'Y';
      this.singleMatchedRegistrantLink(memberDetails);
    } else if (this.matchedProfileCount > 1) {
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
        this.sortByAuthenticationFactor(this.matchedProfiles)
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
    matchedProfiles: RegistrantProfile[]
  ): RegistrantProfile[] {
    return matchedProfiles.sort((a, b) =>
      a.authenticatedUser === b.authenticatedUser
        ? 0
        : a.authenticatedUser
        ? -1
        : 1
    );
  }

  /**
   * Sorts array based on user verification indicator
   *
   * @param matchedProfiles profile array
   * @returns sorted array
   */
  private sortByVerificationFactor(
    matchedProfiles: RegistrantProfile[]
  ): RegistrantProfile[] {
    return matchedProfiles.sort((a, b) =>
      a.verifiedUser === b.verifiedUser ? 0 : a.verifiedUser ? -1 : 1
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
      this.evacueeSessionService.profileId = memberDetails.linkedRegistrantId;
      this.router.navigate([
        'responder-access/search/evacuee-profile-dashboard'
      ]);
    } else if (value === 'No') {
      this.evacueeSessionService.profileId = memberDetails.linkedRegistrantId;
      this.evacueeSessionService.securityQuestionsOpenedFrom =
        'responder-access/search/essfile-dashboard';
      this.router.navigate(['responder-access/search/security-questions']);
    } else if (value === 'answered') {
      this.evacueeSessionService.profileId = memberDetails.linkedRegistrantId;
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
        registantId: this.matchedProfiles[0].id
      }
    };
    this.evacueeSessionService.profileId = this.matchedProfiles[0].id;
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
      .subscribe((value) => {
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
          this.evacueeSessionService.profileId = value;
          this.router.navigate(['responder-access/search/security-questions']);
        }
      });
  }
}
