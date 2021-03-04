import { Injectable } from '@angular/core';
import { NeedsAssessment } from 'src/app/core/api/models';
import { EvacuationFileDataService } from './evacuation-file-data.service';

@Injectable({ providedIn: 'root' })
export class EvacuationFileMappingService {

    constructor(private evacuationFileDataService: EvacuationFileDataService) { }

    mapCurrentEvacuationFile(evacuationFileList: Array<NeedsAssessment>): void {
        this.evacuationFileDataService.setCurrentEvacuationFiles(evacuationFileList);
        this.evacuationFileDataService.setCurrentEvacuationFileCount(evacuationFileList.length);

    }

    mapPastEvacuationFile(evacuationFileList: Array<NeedsAssessment>): void {
        this.evacuationFileDataService.setPastEvacuationFiles(evacuationFileList);
        this.evacuationFileDataService.setPastEvacuationFileCount(evacuationFileList.length);
    }
}
