import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { Router } from '@angular/router';
import {
  EvacuationFileHouseholdMember,
  HouseholdMemberType
} from 'src/app/core/api/models';
import { EvacuationFileModel } from 'src/app/core/models/evacuation-file.model';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { FileDashboardVerifyDialogComponent } from 'src/app/shared/components/dialog-components/file-dashboard-verify-dialog/file-dashboard-verify-dialog.component';
import { VerifyEvacueeDialogComponent } from 'src/app/shared/components/dialog-components/verify-evacuee-dialog/verify-evacuee-dialog.component';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import * as globalConst from '../../../../core/services/global-constants';
import { EssfileDashboardService } from '../essfile-dashboard.service';

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
  linkedFlag = false;
  public color = '#169BD5';

  constructor(
    private dialog: MatDialog,
    private alertService: AlertService,
    private router: Router,
    private essfileDashboardService: EssfileDashboardService,
    private evacueeSessionService: EvacueeSessionService
  ) {
    // if (this.router.getCurrentNavigation() !== null) {
    //   if (this.router.getCurrentNavigation().extras.state !== undefined) {
    //     const state = this.router.getCurrentNavigation().extras.state as {
    //       file: EvacuationFileModel;
    //     };
    //     this.essFile = state.file;
    //   }
    // } else {
    //   // this.essFile = this.essfileDashboardService.essFile;
    // }
  }

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
        height: '480px',
        width: '620px'
      })
      .afterClosed()
      .subscribe((value) => {
        console.log(value);
        if (value === 'Yes') {
          this.evacueeSessionService.profileId =
            memberDetails.linkedRegistrantId;
          this.router.navigate([
            'responder-access/search/evacuee-profile-dashboard'
          ]);
        } else if (value === 'No') {
          this.evacueeSessionService.profileId =
            memberDetails.linkedRegistrantId;
          this.evacueeSessionService.securityQuestionsOpenedFrom =
            'responder-access/search/essfile-dashboard';
          this.router.navigate(['responder-access/search/security-questions']);
        } else if (value === 'answered') {
          this.evacueeSessionService.profileId =
            memberDetails.linkedRegistrantId;
          this.router.navigate([
            'responder-access/search/evacuee-profile-dashboard'
          ]);
        }
      });
  }

  createProfile(file) {}

  linkToProfile(file) {}

  /**
   * Open the dialog with definition of
   * profile status
   */
  // openStatusDefinition(): void {
  //   this.dialog.open(DialogComponent, {
  //     data: {
  //       component: FileStatusDefinitionComponent,
  //       content: 'All'
  //     },
  //     height: '650px',
  //     width: '500px'
  //   });
  // }
}
