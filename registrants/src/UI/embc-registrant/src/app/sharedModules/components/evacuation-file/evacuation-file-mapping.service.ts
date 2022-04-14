import { Injectable } from '@angular/core';
import { first } from 'rxjs/operators';
import { FormCreationService } from 'src/app/core/services/formCreation.service';
import { RestrictionService } from 'src/app/feature-components/restriction/restriction.service';
import { EvacuationFileModel } from '../../../core/model/evacuation-file.model';
import { NeedsAssessmentMappingService } from '../../../feature-components/needs-assessment/needs-assessment-mapping.service';
import { EvacuationFileDataService } from './evacuation-file-data.service';

@Injectable({ providedIn: 'root' })
export class EvacuationFileMappingService {
  constructor(
    private needsAssessmentMapService: NeedsAssessmentMappingService,
    private evacuationFileDataService: EvacuationFileDataService,
    private restrictionService: RestrictionService,
    private formCreationService: FormCreationService
  ) {}

  public mapEvacuationFile(evacuationFile: EvacuationFileModel): void {
    this.evacuationFileDataService.essFileId = evacuationFile.fileId;
    this.evacuationFileDataService.externalReferenceId =
      evacuationFile.manualFileId;
    this.evacuationFileDataService.isPaper = evacuationFile.isPaper;
    this.evacuationFileDataService.evacuatedAddress =
      evacuationFile.evacuatedAddress;
    this.evacuationFileDataService.evacuationFileDate =
      evacuationFile.evacuationFileDate;
    this.evacuationFileDataService.evacuationFileStatus = evacuationFile.status;
    this.needsAssessmentMapService.setNeedsAssessment(
      evacuationFile.evacuatedAddress,
      evacuationFile.needsAssessment
    );
    this.mapSecretPhrase(
      evacuationFile.secretPhrase,
      evacuationFile.secretPhraseEdited
    );
    this.restrictionService.restrictedAccess = evacuationFile.isRestricted;
    this.evacuationFileDataService.supports = evacuationFile.supports;
  }

  private mapSecretPhrase(
    secretPhrase: string,
    secretPhraseEdited: boolean
  ): void {
    this.evacuationFileDataService.secretPhrase = secretPhrase;
    this.evacuationFileDataService.secretPhraseEdited = secretPhraseEdited;

    this.formCreationService
      .getSecretForm()
      .pipe(first())
      .subscribe((details) => {
        details.setValue({ secretPhrase });
      });
  }
}
