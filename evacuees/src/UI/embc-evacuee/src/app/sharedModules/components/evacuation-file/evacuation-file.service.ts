import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import { EvacuationFile } from 'src/app/core/api/models';
import { EvacuationsService } from 'src/app/core/api/services';
import { EvacuationFileDataService } from './evacuation-file-data.service';
import { EvacuationFileMappingService } from './evacuation-file-mapping.service';

@Injectable({ providedIn: 'root' })
export class EvacuationFileService {

  constructor(
    private evacuationService: EvacuationsService, private evacuationFileDataService: EvacuationFileDataService,
    private evacuationFileMapping: EvacuationFileMappingService) { }

  getCurrentEvacuationFiles(): Observable<Array<EvacuationFile>> {
    return this.evacuationService.evacuationsGetCurrentEvacuations();
  }

  getPastEvacuationFiles(): Observable<Array<EvacuationFile>> {
    return this.evacuationService.evacuationsGetPastEvacuations();
  }

  updateEvacuationFile(): Observable<string> {
    // console.log({
    //     essFileNumber: this.evacuationFileDataService.essFileNumber,
    //     body: this.evacuationFileDataService.createEvacuationFileDTO()
    // });
    return this.evacuationService.evacuationsUpdateEvacuation({
      essFileNumber: this.evacuationFileDataService.essFileNumber,
      body: this.evacuationFileDataService.createEvacuationFileDTO()
    }).pipe(
      mergeMap(essFileNumber => this.getCurrentEvacuationFiles()),
      map(evacFiles => {
        const updatedEvacFile = evacFiles.filter(
          evacFile => evacFile.essFileNumber === this.evacuationFileDataService.essFileNumber)[0];
        this.evacuationFileMapping.mapEvacuationFile(updatedEvacFile);
        return updatedEvacFile.essFileNumber;
      })
    );
  }

}
