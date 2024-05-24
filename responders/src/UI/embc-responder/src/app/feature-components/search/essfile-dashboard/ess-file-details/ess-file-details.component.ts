import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EvacuationFileModel } from 'src/app/core/models/evacuation-file.model';
import { HouseholdMemberModel } from 'src/app/core/models/household-member.model';
import { EssfileDashboardService } from '../essfile-dashboard.service';
import * as globalConst from '../../../../core/services/global-constants';
import { EvacuationFileHouseholdMember } from 'src/app/core/api/models';
import { MaskEvacuatedAddressPipe } from '../../../../shared/pipes/maskEvacuatedAddress.pipe';
import {
  MatTable,
  MatColumnDef,
  MatHeaderCellDef,
  MatHeaderCell,
  MatCellDef,
  MatCell,
  MatHeaderRowDef,
  MatHeaderRow,
  MatRowDef,
  MatRow
} from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MaskTextPipe } from 'src/app/shared/pipes/maskText.pipe';

@Component({
  selector: 'app-ess-file-details',
  templateUrl: './ess-file-details.component.html',
  styleUrls: ['./ess-file-details.component.scss'],
  standalone: true,
  imports: [
    MatCard,
    MatCardContent,
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    DatePipe,
    MaskEvacuatedAddressPipe,
    MaskTextPipe
  ]
})
export class EssFileDetailsComponent implements OnInit {
  noAssistanceRequiredMessage = globalConst.noAssistanceRequired;
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
