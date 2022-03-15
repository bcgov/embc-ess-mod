import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, mergeMap, withLatestFrom } from 'rxjs/operators';
import { RegistrantFeaturesResponse, RegistrationResult } from '../api/models';
import { EvacuationFile } from '../api/models/evacuation-file';
import { RegistrationsService } from '../api/services';
import { EvacuationFileModel } from '../models/evacuation-file.model';
import { EvacueeSessionService } from './evacuee-session.service';
import { LocationsService } from './locations.service';

@Injectable({
  providedIn: 'root'
})
export class EssFileService {
  constructor(
    private registrationsService: RegistrationsService,
    private locationsService: LocationsService,
    private evacueeSessionService: EvacueeSessionService
  ) {}

  /**
   * Fetches ESS File record from API and maps the location codes
   * to description
   *
   * @returns ESS File record
   */
  public getFileFromId(fileId: string): Observable<EvacuationFileModel> {
    const file$ = this.registrationsService.registrationsGetFile({
      fileId
    });
    const eligibility$ = this.getEtransferEligibility(
      this.evacueeSessionService?.evacueeMetaData?.registrantId
    );

    return file$.pipe(
      withLatestFrom(eligibility$),
      map(([file, registrantFeaturesResponse]) => {
        return {
          ...file,
          evacuatedFromAddress:
            this.locationsService.getAddressModelFromAddress(
              file.evacuatedFromAddress
            ),
          assignedTaskCommunity: this.locationsService.mapCommunityFromCode(
            file?.task?.communityCode
          ),
          isEtransferEligible: registrantFeaturesResponse.eTransfer
        };
      })
    );
  }

  /**
   * Create new ESS File and fetches the created ESS File
   *
   * @param essFile ESS File data to send to API
   *
   * @returns API profile mapped as EvacuationFileLocal
   */
  public createFile(essFile: EvacuationFile): Observable<EvacuationFileModel> {
    return this.registrationsService
      .registrationsCreateFile({ body: essFile })
      .pipe(
        mergeMap((fileResult: RegistrationResult) =>
          this.getFileFromId(fileResult.id)
        )
      );
  }

  public getEtransferEligibility(
    registrantId: string
  ): Observable<RegistrantFeaturesResponse> {
    return this.registrationsService.registrationsGetRegistrantFeatures({
      registrantId
    });
  }

  /**
   * Update existing ESS File
   *
   * @param fileId ID of ESS File to update
   * @param essFile ESS File data to send to API
   *
   * @returns API profile mapped as EvacuationFileLocal
   */
  public updateFile(
    fileId: string,
    essFile: EvacuationFile
  ): Observable<EvacuationFileModel> {
    return this.registrationsService
      .registrationsUpdateFile({
        fileId,
        body: essFile
      })
      .pipe(
        mergeMap((regResult: RegistrationResult) =>
          this.getFileFromId(regResult.id)
        )
      );
  }
}
