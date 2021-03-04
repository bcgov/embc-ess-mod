import { Injectable } from '@angular/core';
import { NeedsAssessment } from 'src/app/core/api/models';

@Injectable({ providedIn: 'root' })
export class EvacuationFileDataService {

    private currentEvacuationFileCount: number;
    private currentEvacuationFiles: Array<NeedsAssessment>;
    private pastEvacuationFileCount: number;
    private pastEvacuationFiles: Array<NeedsAssessment>;
    private selectedEvacuationFile: NeedsAssessment;

    constructor() { }

    getCurrentEvacuationFileCount(): number {
        console.log(this.currentEvacuationFileCount);
        return this.currentEvacuationFileCount;
    }

    setCurrentEvacuationFileCount(count: number): void {
        this.currentEvacuationFileCount = count;
    }

    getCurrentEvacuationFiles(): Array<NeedsAssessment> {
        console.log(this.currentEvacuationFiles);
        return this.currentEvacuationFiles;
    }

    setCurrentEvacuationFiles(currentList: Array<NeedsAssessment>): void {
        this.currentEvacuationFiles = currentList;
        console.log(this.currentEvacuationFiles);
    }

    getPastEvacuationFileCount(): number {
        console.log(this.pastEvacuationFileCount);
        return this.pastEvacuationFileCount;
    }

    setPastEvacuationFileCount(count: number): void {
        this.pastEvacuationFileCount = count;
    }

    getPastEvacuationFiles(): Array<NeedsAssessment> {
        console.log(this.pastEvacuationFiles);
        return this.pastEvacuationFiles;
    }

    setPastEvacuationFiles(pastList: Array<NeedsAssessment>): void {
        this.pastEvacuationFiles = pastList;
    }

    getSelectedEvacuationFile(): NeedsAssessment {
        return this.selectedEvacuationFile;
    }

    setSelectedEvacuationFile(evacuationFile: NeedsAssessment): void {
        this.selectedEvacuationFile = evacuationFile;
    }
}
