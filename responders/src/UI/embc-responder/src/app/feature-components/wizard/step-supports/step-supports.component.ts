import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Referral } from 'src/app/core/api/models';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
import { LocationsService } from 'src/app/core/services/locations.service';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { StepSupportsService } from './step-supports.service';
import * as globalConst from '../../../core/services/global-constants';

@Component({
  selector: 'app-step-supports',
  templateUrl: './step-supports.component.html',
  styleUrls: ['./step-supports.component.scss']
})
export class StepSupportsComponent implements OnInit {
  stepName: string;
  stepId: string;

  constructor(
    private router: Router,
    private stepSupportsService: StepSupportsService,
    private alertService: AlertService
  ) {
    if (this.router.getCurrentNavigation() !== null) {
      if (this.router.getCurrentNavigation().extras.state !== undefined) {
        const state = this.router.getCurrentNavigation().extras.state as {
          step: string;
          title: string;
        };
        this.stepId = state.step;
        this.stepName = state.title;
      }
    }
  }

  ngOnInit(): void {
    this.stepSupportsService.getSupplierList().subscribe((value) => {
      this.stepSupportsService.supplierList = value;
    });
  }
}
