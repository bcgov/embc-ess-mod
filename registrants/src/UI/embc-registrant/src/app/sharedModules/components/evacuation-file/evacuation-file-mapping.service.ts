import { Injectable } from '@angular/core';
import { RestrictionService } from 'src/app/feature-components/restriction/restriction.service';
import { EvacuationFileModel } from '../../../core/model/evacuation-file.model';
import { NeedsAssessmentMappingService } from '../../../feature-components/needs-assessment/needs-assessment-mapping.service';
import { EvacuationFileDataService } from './evacuation-file-data.service';

@Injectable({ providedIn: 'root' })
export class EvacuationFileMappingService {
  constructor(
    private needsAssessmentMapService: NeedsAssessmentMappingService,
    private evacuationFileDataService: EvacuationFileDataService,
    private restrictionService: RestrictionService
  ) {}

  public mapEvacuationFile(evacuationFile: EvacuationFileModel): void {
    this.evacuationFileDataService.essFileId = evacuationFile.fileId;
    this.evacuationFileDataService.evacuatedAddress =
      evacuationFile.evacuatedAddress;
    this.evacuationFileDataService.evacuationFileDate =
      evacuationFile.evacuationFileDate;
    this.evacuationFileDataService.evacuationFileStatus = evacuationFile.status;
    this.needsAssessmentMapService.setNeedsAssessment(
      evacuationFile.evacuatedAddress,
      evacuationFile.needsAssessment
    );
    this.evacuationFileDataService.secretPhrase = evacuationFile.secretPhrase;
    this.evacuationFileDataService.secretPhraseEdited =
      evacuationFile.secretPhraseEdited;
    this.restrictionService.restrictedAccess = evacuationFile.isRestricted;
  }
}
