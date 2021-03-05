import { Injectable } from "@angular/core";
import { NeedsAssessment } from "src/app/core/api/models";

@Injectable({ providedIn: 'root' })
export class EvacuationFileDataService {

    private currentEvacuationFiles: Array<NeedsAssessment>
    private currentEvacuationFileCount: number;

    private pastEvacuationFiles: Array<NeedsAssessment>
    private pastEvacuationFileCount: number;

    getCurrentEvacuationFiles(): Array<NeedsAssessment> {
        return this.currentEvacuationFiles;
    }

    setCurrentEvacuationFiles(evacuationFiles: Array<NeedsAssessment>): void {
        this.currentEvacuationFiles = evacuationFiles;
    }

    getCurrentEvacuationFileCount(): number {
        return this.currentEvacuationFileCount;
    }

    setCurrentEvacuationFileCount(count: number): void {
        this.currentEvacuationFileCount = count;
    }


    getPastEvacuationFiles(): Array<NeedsAssessment> {
        return this.pastEvacuationFiles;
    }

    setPastEvacuationFiles(evacuationFiles: Array<NeedsAssessment>): void {
        this.pastEvacuationFiles = evacuationFiles;
    }

    getPastEvacuationFileCount(): number {
        return this.pastEvacuationFileCount;
    }

    setPastEvacuationFileCount(count: number): void {
        this.pastEvacuationFileCount = count;
    }
}
