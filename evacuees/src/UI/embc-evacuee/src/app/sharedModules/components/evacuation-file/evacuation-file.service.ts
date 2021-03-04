import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NeedsAssessment } from 'src/app/core/api/models';
import { EvacuationService } from 'src/app/core/api/services';
import { DataService } from 'src/app/core/services/data.service';

@Injectable({ providedIn: 'root' })
export class EvacuationFileService {

    private evacuationFile: NeedsAssessment;

    constructor(private evacuationService: EvacuationService, private dataService: DataService) { }

    createEvacuationFile(): Observable<string> {
        this.evacuationFile = this.mergeData({}, this.dataService.getNeedsAssessment());
        console.log(JSON.stringify(this.evacuationFile));
        return this.evacuationService.evacuationCreateEvacuation({ body: this.evacuationFile });
    }

    private mergeData(finalValue, incomingValue): any {
        return { ...finalValue, ...incomingValue };
    }
}