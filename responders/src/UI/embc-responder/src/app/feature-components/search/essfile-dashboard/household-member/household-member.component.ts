import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import {
  EvacuationFileHouseholdMember,
  HouseholdMemberType,
  RegistrantProfileSearchResult
} from 'src/app/core/api/models';
import { EvacuationFileModel } from 'src/app/core/models/evacuation-file.model';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import * as globalConst from '../../../../core/services/global-constants';
import { EssfileDashboardService } from '../essfile-dashboard.service';
import { AppBaseService } from 'src/app/core/services/helper/appBase.service';
import { SelectedPathType } from 'src/app/core/models/appBase.model';
import { HouseholdMemberService } from './household-member.service';

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
    private alertService: AlertService,
    private appBaseService: AppBaseService,
    private householdMemberService: HouseholdMemberService
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
    this.householdMemberService.viewMemberProfile(memberDetails);
  }

  createProfile(memberDetails: EvacuationFileHouseholdMember) {
    this.householdMemberService.createMemberProfile(memberDetails);
  }

  linkToProfile(memberDetails: EvacuationFileHouseholdMember) {
    this.householdMemberService.linkMemberProfile(memberDetails, this.essFile);
  }
}
