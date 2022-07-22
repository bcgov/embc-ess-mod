import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EvacuationFileModel } from 'src/app/core/models/evacuation-file.model';
import { HouseholdMemberModel } from 'src/app/core/models/household-member.model';
import { EssfileDashboardService } from '../essfile-dashboard.service';
import * as globalConst from '../../../../core/services/global-constants';
import { EvacuationFileHouseholdMember } from 'src/app/core/api/models';

@Component({
  selector: 'app-ess-file-details',
  templateUrl: './ess-file-details.component.html',
  styleUrls: ['./ess-file-details.component.scss']
})
export class EssFileDetailsComponent implements OnInit {
  essFile: EvacuationFileModel;

  memberListDisplay: EvacuationFileHouseholdMember[];

  memberColumns: string[] = ['firstName', 'lastName', 'dateOfBirth'];
  petColumns: string[] = ['type', 'quantity'];

  constructor(
    private router: Router,
    private essfileDashboardService: EssfileDashboardService
  ) {
    if (this.router.getCurrentNavigation() !== null) {
      if (this.router.getCurrentNavigation().extras.state !== undefined) {
        const state = this.router.getCurrentNavigation().extras.state as {
          file: EvacuationFileModel;
        };
        this.essFile = state.file;
      }
    } else {
      this.essFile = this.essfileDashboardService.essFile;
    }
  }

  ngOnInit(): void {
    this.memberListDisplay = this.essFile?.needsAssessment?.householdMembers;
  }

  /**
   * Maps needs assessment api value to UI string
   *
   * @param incomingValue needs assessment value
   * @returns
   */
  mapNeedsValues(incomingValue: boolean | null): string {
    return globalConst.needsOptions.find(
      (ins) => ins.apiValue === incomingValue
    )?.name;
  }
}
