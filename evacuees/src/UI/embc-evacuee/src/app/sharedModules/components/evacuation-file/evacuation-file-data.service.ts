import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { NeedsAssessment } from "src/app/core/api/models";

@Injectable({ providedIn: 'root' })
export class EvacuationFileDataService {

    private currentEvacuationFiles: Array<NeedsAssessment>
    private currentEvacuationFileCount: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    public currentEvacuationFileCount$: Observable<number> = this.currentEvacuationFileCount.asObservable();

    private pastEvacuationFiles: Array<NeedsAssessment>
    private pastEvacuationFileCount: number;

    getCurrentEvacuationFiles(): Array<NeedsAssessment> {
        return this.currentEvacuationFiles;
    }

    setCurrentEvacuationFiles(evacuationFiles: Array<NeedsAssessment>): void {
        this.currentEvacuationFiles = evacuationFiles;
    }

    getCurrentEvacuationFileCount(): Observable<number> {
        return this.currentEvacuationFileCount$;
    }

    setCurrentEvacuationFileCount(count: number): void {
        this.currentEvacuationFileCount.next(count);
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
