import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { concatMap, concatMapTo, map, mergeMap } from 'rxjs/operators';
import { Support } from 'src/app/core/api/models/support';
import { RegistrationsService } from 'src/app/core/api/services';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { StepSupportsService } from '../../step-supports/step-supports.service';
import * as globalConst from '../../../../core/services/global-constants';
import { LocationsService } from 'src/app/core/services/locations.service';
import { Referral } from 'src/app/core/api/models/referral';

@Injectable({ providedIn: 'root' })
export class ReviewSupportService {
  private includeEvacueeSummaryVal: boolean;

  constructor(private registrationService: RegistrationsService) {}

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
}
