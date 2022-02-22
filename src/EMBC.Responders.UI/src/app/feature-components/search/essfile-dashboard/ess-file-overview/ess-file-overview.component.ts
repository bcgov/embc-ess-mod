import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EvacuationFileModel } from 'src/app/core/models/evacuation-file.model';
import { EssfileDashboardService } from '../essfile-dashboard.service';
import * as globalConst from '../../../../core/services/global-constants';

@Component({
  selector: 'app-ess-file-overview',
  templateUrl: './ess-file-overview.component.html',
  styleUrls: ['./ess-file-overview.component.scss']
})
export class EssFileOverviewComponent implements OnInit {
  essFile: EvacuationFileModel;
  animalCount = 0;

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
    this.calculateAnimalsTotal();
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

  private calculateAnimalsTotal(): void {
    if (this.essFile?.needsAssessment?.pets?.length > 0) {
      for (const pet of this.essFile?.needsAssessment?.pets) {
        this.animalCount += +pet.quantity;
      }
    }
  }
}
