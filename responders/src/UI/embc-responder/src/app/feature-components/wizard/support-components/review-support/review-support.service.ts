import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import {
  Referral,
  ReferralPrintRequestResponse
} from 'src/app/core/api/models';
import { Support } from 'src/app/core/api/models/support';
import { RegistrationsService } from 'src/app/core/api/services';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
import { LocationsService } from 'src/app/core/services/locations.service';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { StepSupportsService } from '../../step-supports/step-supports.service';
import * as globalConst from '../../../../core/services/global-constants';
import { mergeMap } from 'rxjs/operators';
import { AppBaseService } from 'src/app/core/services/helper/appBase.service';

@Injectable({ providedIn: 'root' })
export class ReviewSupportService {
  private includeEvacueeSummaryVal: boolean;

  constructor(
    private registrationService: RegistrationsService,
    private stepSupportsService: StepSupportsService,
    private evacueeSessionService: EvacueeSessionService,
    private locationsService: LocationsService,
    private alertService: AlertService,
    private appBaseService: AppBaseService
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
  processSupports(fileId: string, supportsDraft: Support[]): Observable<Blob> {
    return this.registrationService
      .registrationsProcessSupports({
        fileId,
        body: {
          includeSummaryInPrintRequest: this.includeEvacueeSummary,
          supports: supportsDraft
        }
      })
      .pipe(
        mergeMap((result: ReferralPrintRequestResponse) => {
          const printRequestId = result.printRequestId;
          return this.registrationService.registrationsGetPrint({
            fileId,
            printRequestId
          });
        })
      );
  }

  savePaperSupports(
    fileId: string,
    supportsDraft: Support[]
  ): Observable<void> {
    return this.registrationService.registrationsProcessPaperReferrals({
      fileId,
      body: {
        referrals: supportsDraft
      }
    });
  }

  updateExistingSupportsList(): void {
    this.stepSupportsService
      .getEvacFile(this.appBaseService?.appModel?.selectedEssFile?.id)
      .subscribe({
        next: (file) => {
          this.evacueeSessionService.currentNeedsAssessment =
            file.needsAssessment;
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
                  (support.supportDelivery as Referral).supplierAddress
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
        error: (error) => {
          this.alertService.clearAlert();
          this.alertService.setAlert('danger', globalConst.genericError);
        }
      });
  }
}
