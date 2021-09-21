import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Support } from 'src/app/core/api/models/support';
import { RegistrationsService } from 'src/app/core/api/services';

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
