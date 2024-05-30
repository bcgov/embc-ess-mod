import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { StepSupportsService } from './step-supports.service';
import * as globalConst from '../../../core/services/global-constants';
import { AlertComponent } from '../../../shared/components/alert/alert.component';

@Component({
  selector: 'app-step-supports',
  templateUrl: './step-supports.component.html',
  styleUrls: ['./step-supports.component.scss'],
  standalone: true,
  imports: [AlertComponent, RouterOutlet]
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
    this.stepSupportsService.getSupplierList().subscribe({
      next: (value) => {
        this.stepSupportsService.supplierList = value;
      },
      error: (error) => {
        this.alertService.clearAlert();
        this.alertService.setAlert('danger', globalConst.mainSuppliersListError);
      }
    });
  }
}
