import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import { EvacuationFile } from 'src/app/core/api/models';
import { EvacuationsService } from 'src/app/core/api/services';
import { EvacuationFileModel } from 'src/app/core/model/evacuation-file.model';
import { LocationService } from 'src/app/core/services/location.service';
import { EvacuationFileDataService } from './evacuation-file-data.service';
import { EvacuationFileMappingService } from './evacuation-file-mapping.service';

@Injectable({ providedIn: 'root' })
export class EvacuationFileService {
  constructor(
    private evacuationService: EvacuationsService,
    private evacuationFileDataService: EvacuationFileDataService,
    private evacuationFileMapping: EvacuationFileMappingService,
    private locationService: LocationService
  ) {}

  getCurrentEvacuationFiles(): Observable<Array<EvacuationFileModel>> {
    const currentEssFilesResult: Array<EvacuationFileModel> = [];
    return this.evacuationService.evacuationsGetCurrentEvacuations().pipe(
      map(
        (
          currentEssFiles: Array<EvacuationFile>
        ): Array<EvacuationFileModel> => {
          currentEssFiles.forEach((item) => {
            const essFileItem: EvacuationFileModel = {
              ...item,
              evacuatedAddress: this.locationService.getAddressRegFromAddress(
                item.evacuatedFromAddress
              )
            };
            currentEssFilesResult.push(essFileItem);
          });
          return currentEssFilesResult;
        }
      )
    );
  }

  getPastEvacuationFiles(): Observable<Array<EvacuationFileModel>> {
    const pastEssFilesResult: Array<EvacuationFileModel> = [];
    return this.evacuationService.evacuationsGetPastEvacuations().pipe(
      map(
        (
          currentEssFiles: Array<EvacuationFile>
        ): Array<EvacuationFileModel> => {
          currentEssFiles.forEach((item) => {
            const essFileItem: EvacuationFileModel = {
              ...item,
              evacuatedAddress: this.locationService.getAddressRegFromAddress(
                item.evacuatedFromAddress
              )
            };
            pastEssFilesResult.push(essFileItem);
          });
          return pastEssFilesResult;
        }
      )
    );
  }

  updateEvacuationFile(): Observable<string> {
    return this.evacuationService
      .evacuationsUpsertEvacuationFile({
        body: this.evacuationFileDataService.createEvacuationFileDTO()
      })
      .pipe(
        mergeMap((essFileNumber) => this.getCurrentEvacuationFiles()),
        map((evacFiles: EvacuationFile[]) => {
          const updatedEvacFile: EvacuationFile = evacFiles.filter(
            (evacFile) =>
              evacFile.fileId === this.evacuationFileDataService.essFileId
          )[0];

          const updatedEvacFileModel: EvacuationFileModel = {
            ...updatedEvacFile,
            evacuatedAddress: this.locationService.getAddressRegFromAddress(
              updatedEvacFile.evacuatedFromAddress
            )
          };
          this.evacuationFileMapping.mapEvacuationFile(updatedEvacFileModel);
          return updatedEvacFile.fileId;
        })
      );
  }
}
