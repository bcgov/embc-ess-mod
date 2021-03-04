import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { NeedsAssessment } from "src/app/core/api/models/needs-assessment";
import { EvacuationService } from "src/app/core/api/services/evacuation.service";
import { DataService } from "src/app/core/services/data.service";
import { EvacuationFileDataService } from "./evacuation-file-data.service";
import { EvacuationFileMappingService } from "./evacuation-file-mapping.service";

@Injectable({ providedIn: 'root' })
export class EvacuationFileService {

    private evacuationFile: NeedsAssessment;

    constructor(private evacuationService: EvacuationService, private dataService: DataService, private evacuationFileDataService: EvacuationFileDataService) { }

    getCurrentEvacuationFiles(): void {
        this.evacuationService.evacuationGetCurrentEvacuations().subscribe(evacuationFileList => {
            this.evacuationFileDataService.setCurrentEvacuationFiles(evacuationFileList);
            this.evacuationFileDataService.setCurrentEvacuationFileCount(evacuationFileList.length);
        });
    }

    getPastEvacuationFiles(): void {
        this.evacuationService.evacuationGetPastEvacuations().subscribe(evacuationFileList => {
            this.evacuationFileDataService.setPastEvacuationFiles(evacuationFileList);
            this.evacuationFileDataService.setPastEvacuationFileCount(evacuationFileList.length);
        });
    }

    createEvacuationFile(): Observable<string> {
        this.evacuationFile = this.mergeData({}, this.dataService.getNeedsAssessment());
        console.log(JSON.stringify(this.evacuationFile));
        return this.evacuationService.evacuationCreateEvacuation({ body: this.evacuationFile });
    }

    private mergeData(finalValue, incomingValue): any {
        return { ...finalValue, ...incomingValue };
    }

}

