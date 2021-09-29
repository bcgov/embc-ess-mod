import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Referral } from 'src/app/core/api/models';
import { Support } from 'src/app/core/api/models/support';
import { RegistrationsService } from 'src/app/core/api/services';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
import { LocationsService } from 'src/app/core/services/locations.service';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { StepSupportsService } from '../../step-supports/step-supports.service';
import * as globalConst from '../../../../core/services/global-constants';

@Injectable({ providedIn: 'root' })
export class ReviewSupportService {
  private includeEvacueeSummaryVal: boolean;

  constructor(
    private registrationService: RegistrationsService,
    private stepSupportsService: StepSupportsService,
    private evacueeSessionService: EvacueeSessionService,
    private locationsService: LocationsService,
    private alertService: AlertService
  ) {}

  public get includeEvacueeSummary(): boolean {
    return this.includeEvacueeSummaryVal;
  }
  public set includeEvacueeSummary(value: boolean) {
    this.includeEvacueeSummaryVal = value;
  }

  /**
   * Calls the REST API to post new supports associated to a given ESSFile
   */
  processSupports(fileId: string, supportsDraft: Support[]): Observable<void> {
    return this.registrationService.registrationsProcessSupports({
      fileId,
      body: supportsDraft
    });
  }

  updateExistingSupportsList(): void {
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
          // this.stepSupportsService.evacFile = file;
        },
        (error) => {
          this.alertService.clearAlert();
          this.alertService.setAlert('danger', globalConst.genericError);
        }
      );
  }
}
