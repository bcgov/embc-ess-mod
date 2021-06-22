import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { StepCreateEssFileService } from 'src/app/feature-components/wizard/step-create-ess-file/step-create-ess-file.service';
import { RegistrationResult } from '../api/models';
import { EvacuationFile } from '../api/models/evacuation-file';
import { RegistrationsService } from '../api/services';
import { AddressModel } from '../models/address.model';
import { EvacuationFileModel } from '../models/evacuation-file.model';
import { LocationsService } from './locations.service';

@Injectable({
  providedIn: 'root'
})
export class EssFileService {
  constructor(
    private registrationsService: RegistrationsService,
    private stepCreateEssFileService: StepCreateEssFileService,
    private locationService: LocationsService
  ) {}

  /**
   * Fetches ESS File record from API and maps the location codes
   * to description
   *
   * @returns ESS File record
   */
  public getFileFromId(fileId: string): Observable<EvacuationFileModel> {
    return this.registrationsService
      .registrationsGetFile({
        fileId
      })
      .pipe(
        map((file: EvacuationFileModel) => {
          const communities = this.locationService.getCommunityList();
          const countries = this.locationService.getCountriesList();
          const stateProvinces = this.locationService.getStateProvinceList();

          const evacCommunity = communities.find(
            (comm) => comm.code === file.evacuatedFromAddress.communityCode
          );
          const evacCountry = countries.find(
            (coun) => coun.code === file.evacuatedFromAddress.countryCode
          );
          const evacStateProvince = stateProvinces.find(
            (sp) => sp.code === file.evacuatedFromAddress.stateProvinceCode
          );

          const evacAddressModel: AddressModel = {
            community: evacCommunity,
            country: evacCountry,
            stateProvince: evacStateProvince
          };

          file.evacuatedFromAddress = {
            ...evacAddressModel,
            ...file.evacuatedFromAddress
          };

          this.stepCreateEssFileService.getEvacFileDTO(file);
          return file;
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
