import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EvacuationFileModel } from 'src/app/core/models/evacuation-file.model';
import { EssfileDashboardService } from '../essfile-dashboard.service';

@Component({
  selector: 'app-ess-file-overview',
  templateUrl: './ess-file-overview.component.html',
  styleUrls: ['./ess-file-overview.component.scss']
})
export class EssFileOverviewComponent implements OnInit {
  essFile: EvacuationFileModel;

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
        console.log(this.essFile);
      }
    } else {
      this.essFile = this.essfileDashboardService.essFile;
    }
  }

  ngOnInit(): void {}
}
