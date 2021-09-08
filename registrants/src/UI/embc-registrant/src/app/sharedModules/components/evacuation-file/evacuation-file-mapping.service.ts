import { Injectable } from '@angular/core';
import { EvacuationFileModel } from 'src/app/core/model/evacuation-file.model';
import { NeedsAssessmentMappingService } from '../../../feature-components/needs-assessment/needs-assessment-mapping.service';
import { EvacuationFileDataService } from './evacuation-file-data.service';

@Injectable({ providedIn: 'root' })
export class EvacuationFileMappingService {
  constructor(
    private needsAssessmentMapService: NeedsAssessmentMappingService,
    private evacuationFileDataService: EvacuationFileDataService
  ) {}

  public mapEvacuationFile(evacuationFile: EvacuationFileModel): void {
    this.evacuationFileDataService.essFileId = evacuationFile.fileId;
    this.evacuationFileDataService.evacuatedAddress =
      evacuationFile.evacuatedAddress;
    this.evacuationFileDataService.evacuationFileDate =
      evacuationFile.evacuationFileDate;
    this.needsAssessmentMapService.setNeedsAssessment(
      evacuationFile.evacuatedAddress,
      evacuationFile.needsAssessment
    );
  }
}
