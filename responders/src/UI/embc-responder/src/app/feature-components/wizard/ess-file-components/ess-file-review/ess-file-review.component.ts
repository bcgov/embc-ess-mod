import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/core/services/user.service';
import { StepCreateEssFileService } from '../../step-create-ess-file/step-create-ess-file.service';
import * as globalConst from '../../../../core/services/global-constants';
import { StepCreateProfileService } from '../../step-create-profile/step-create-profile.service';
import { HouseholdMember } from 'src/app/core/models/evacuation-file';
import { HouseholdMembersComponent } from '../household-members/household-members.component';
import { HouseholdMemberModel } from 'src/app/core/models/HouseholdMember.model';

@Component({
  selector: 'app-ess-file-review',
  templateUrl: './ess-file-review.component.html',
  styleUrls: ['./ess-file-review.component.scss']
})
export class EssFileReviewComponent implements OnInit, OnDestroy {
  taskNumber: string;
  tabUpdateSubscription: Subscription;

  insuranceDisplay: string;

  needsFoodDisplay: string;
  needsLodgingDisplay: string;
  needsClothingDisplay: string;
  needsTransportationDisplay: string;
  needsIncidentalsDisplay: string;

  memberListDisplay: HouseholdMemberModel[];

  memberColumns: string[] = [
    'firstName',
    'lastName',
    'initials',
    'gender',
    'dateOfBirth'
  ];

  petColumns: string[] = ['type', 'quantity'];

  constructor(
    public stepCreateProfileService: StepCreateProfileService,
    public stepCreateEssFileService: StepCreateEssFileService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const userProfile = this.userService.currentProfile;
    this.taskNumber = userProfile.taskNumber;

    // Get the displayed value for radio options
    this.insuranceDisplay = globalConst.insuranceOptions.find(
      (ins) => ins.value === this.stepCreateEssFileService?.insurance
    )?.name;

    this.needsFoodDisplay = globalConst.needsOptions.find(
      (ins) =>
        ins.value === this.stepCreateEssFileService?.canRegistrantProvideFood
    )?.name;

    this.needsLodgingDisplay = globalConst.needsOptions.find(
      (ins) =>
        ins.value === this.stepCreateEssFileService?.canRegistrantProvideLodging
    )?.name;

    this.needsClothingDisplay = globalConst.needsOptions.find(
      (ins) =>
        ins.value ===
        this.stepCreateEssFileService?.canRegistrantProvideClothing
    )?.name;

    this.needsTransportationDisplay = globalConst.needsOptions.find(
      (ins) =>
        ins.value ===
        this.stepCreateEssFileService?.canRegistrantProvideTransportation
    )?.name;

    this.needsIncidentalsDisplay = globalConst.needsOptions.find(
      (ins) =>
        ins.value ===
        this.stepCreateEssFileService?.canRegistrantProvideIncidentals
    )?.name;

    // Add main member to "Household Members" table
    const mainMember: HouseholdMemberModel = {
      sameLastName: true,
      ...this.stepCreateProfileService.personalDetails
    };

    this.memberListDisplay = [
      mainMember,
      ...this.stepCreateEssFileService?.householdMembers
    ];

    // Set "update tab status" method, called for any tab navigation
    this.tabUpdateSubscription = this.stepCreateEssFileService.nextTabUpdate.subscribe(
      () => {
        this.updateTabStatus();
      }
    );
  }

  /**
   * Go back to the Security Phrase tab
   */
  back(): void {
    this.router.navigate(['/ess-wizard/create-ess-file/security-phrase']);
  }

  /**
   * Create or update ESS File and continue to Step 3
   */
  save(): void {
    this.stepCreateEssFileService.nextTabUpdate.next();
  }

  /**
   * Checks the wizard validity and updates the tab status
   */
  updateTabStatus() {
    // If all other tabs are complete and this tab has been viewed, mark complete
    if (!this.stepCreateEssFileService.checkTabsStatus()) {
      this.stepCreateEssFileService.setTabStatus('review', 'complete');
    }
  }

  /**
   * When navigating away from tab, update variable value and status indicator
   */
  ngOnDestroy(): void {
    this.stepCreateEssFileService.nextTabUpdate.next();
    this.tabUpdateSubscription.unsubscribe();
  }
}
