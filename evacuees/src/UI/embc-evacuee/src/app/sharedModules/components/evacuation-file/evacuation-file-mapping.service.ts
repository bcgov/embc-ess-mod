import { Injectable } from '@angular/core';
import { EvacuationFile } from 'src/app/core/api/models';
import { NeedsAssessmentMappingService } from '../needs-assessment/needs-assessment-mapping.service';
import { EvacuationFileDataService } from './evacuation-file-data.service';

@Injectable({ providedIn: 'root' })

export class EvacuationFileMappingService {

    constructor(
        private needsAssessmentMapService: NeedsAssessmentMappingService,
        private evacuationFileDataService: EvacuationFileDataService) { }

    public mapEvacuationFile(evacuationFile: EvacuationFile): void {
        this.evacuationFileDataService.essFileNumber = evacuationFile.essFileNumber;
        this.evacuationFileDataService.evacuatedFromAddress = evacuationFile.evacuatedFromAddress;
        this.evacuationFileDataService.evacuationFileDate = evacuationFile.evacuationFileDate;
        this.needsAssessmentMapService.setNeedsAssessment(evacuationFile.evacuatedFromAddress, evacuationFile.needsAssessments[0]);
    }

}
