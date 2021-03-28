import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import { EvacuationFile } from 'src/app/core/api/models';
import { EvacuationService } from 'src/app/core/api/services';
import { EvacuationFileDataService } from './evacuation-file-data.service';
import { EvacuationFileMappingService } from './evacuation-file-mapping.service';

@Injectable({ providedIn: 'root' })
export class EvacuationFileService {

    constructor(
        private evacuationService: EvacuationService, private evacuationFileDataService: EvacuationFileDataService,
        private evacuationFileMapping: EvacuationFileMappingService) { }

    getCurrentEvacuationFiles(): Observable<Array<EvacuationFile>> {
        return this.evacuationService.evacuationGetCurrentEvacuations();
    }

    getPastEvacuationFiles(): Observable<Array<EvacuationFile>> {
        return this.evacuationService.evacuationGetPastEvacuations();
    }

    updateEvacuationFile(): Observable<string> {
        console.log({
            essFileNumber: this.evacuationFileDataService.essFileNumber,
            body: this.evacuationFileDataService.createEvacuationFileDTO()
        });
        return this.evacuationService.evacuationUpdateEvacuation({
            essFileNumber: this.evacuationFileDataService.essFileNumber,
            body: this.evacuationFileDataService.createEvacuationFileDTO()
        });
        // .pipe(
        //     mergeMap(essFileNumber => this.getCurrentEvacuationFiles()),
        //     map(evacFiles => {
        //         let updatedEvacFile = evacFiles.filter(
        //             evacFile => evacFile.essFileNumber === this.evacuationFileDataService.essFileNumber)[0];
        //         this.evacuationFileMapping.mapEvacuationFile(updatedEvacFile);
        //         return updatedEvacFile.essFileNumber;
        //     })
        // )
    }

}
