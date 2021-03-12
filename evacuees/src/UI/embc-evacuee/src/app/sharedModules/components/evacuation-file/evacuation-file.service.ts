import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NeedsAssessment } from 'src/app/core/api/models';
import { EvacuationService } from 'src/app/core/api/services';

@Injectable({ providedIn: 'root' })
export class EvacuationFileService {

    private evacuationFile: NeedsAssessment;

    constructor(
        private evacuationService: EvacuationService) { }

    getCurrentEvacuationFile(): Observable<Array<NeedsAssessment>> {
        return this.evacuationService.evacuationGetCurrentEvacuations();
    }

    getPastEvacuationFile(): Observable<Array<NeedsAssessment>> {
        return this.evacuationService.evacuationGetPastEvacuations();
    }
}
