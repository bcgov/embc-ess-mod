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
    }
  }

  ngOnInit(): void {
    this.memberListDisplay = this.essFile?.needsAssessment?.householdMembers;
  }

  public get essFile() {
    return this.essfileDashboardService.essFile;
  }

  public set essFile(value: EvacuationFileModel) {
    this.essfileDashboardService.essFile = value;
  }

  public getIdentifiedNeeds(): string[] {
    return this.essfileDashboardService.getIdentifiedNeeds();
  }

}
