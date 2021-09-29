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
    private evacueeSessionService: EvacueeSessionService,
    private locationsService: LocationsService,
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
    this.stepSupportsService.getCategoryList();
    this.stepSupportsService.getSubCategoryList();
    this.stepSupportsService
      .getEvacFile(this.evacueeSessionService.essFileNumber)
      .subscribe(
        (file) => {
          this.stepSupportsService.currentNeedsAssessment =
            file.needsAssessment;
          console.log(file.supports);
          const supportModel = [];

          file.supports.forEach((support) => {
            if (
              support.subCategory === 'Lodging_Group' ||
              support.subCategory === 'Lodging_Billeting'
            ) {
              supportModel.push(support);
            } else {
              const value = {
                ...support,
                hostAddress: this.locationsService.getAddressModelFromAddress(
                  (support as Referral).supplierAddress
                )
              };
              supportModel.push(value);
            }
          });

          this.stepSupportsService.setExistingSupportList(
            supportModel.sort(
              (a, b) => new Date(b.from).valueOf() - new Date(a.from).valueOf()
            )
          );
          this.stepSupportsService.evacFile = file;
        },
        (error) => {
          this.alertService.clearAlert();
          this.alertService.setAlert('danger', globalConst.genericError);
        }
      );
    this.stepSupportsService.getSupplierList().subscribe((value) => {
      this.stepSupportsService.supplierList = value;
    });
  }
}
