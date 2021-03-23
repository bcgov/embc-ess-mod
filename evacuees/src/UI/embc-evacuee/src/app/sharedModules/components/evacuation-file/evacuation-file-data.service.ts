import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Address, EvacuationFile, NeedsAssessment } from 'src/app/core/api/models';
import { EvacuationService } from 'src/app/core/api/services';
import { NeedsAssessmentService } from '../needs-assessment/needs-assessment.service';

@Injectable({ providedIn: 'root' })
export class EvacuationFileDataService {

    private _essFileNumber: string;
    private _evacuatedFromAddress: Address;
    private _evacuationFileDate: string;
    private _needsAssessments: Array<NeedsAssessment> = [];
    private _evacuationFileStatus: string;
    private _evacuationFile: EvacuationFile;

    private currentEvacuationFiles: Array<NeedsAssessment>;
    private currentEvacuationFileCount: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    public currentEvacuationFileCount$: Observable<number> = this.currentEvacuationFileCount.asObservable();
    private pastEvacuationFiles: Array<NeedsAssessment>;
    private pastEvacuationFileCount: number;

    constructor(private evacuationService: EvacuationService, private needsAssessmentService: NeedsAssessmentService) { }


    public get essFileNumber(): string {
        return this._essFileNumber;
    }
    public set essFileNumber(value: string) {
        this._essFileNumber = value;
    }

    public get evacuationFileDate(): string {
        return this._evacuationFileDate;
    }
    public set evacuationFileDate(value: string) {
        this._evacuationFileDate = value;
    }

    public get evacuatedFromAddress(): Address {
        return this._evacuatedFromAddress;
    }
    public set evacuatedFromAddress(value: Address) {
        this._evacuatedFromAddress = value;
    }

    public get evacuationFileStatus(): string {
        return this._evacuationFileStatus;
    }
    public set evacuationFileStatus(value: string) {
        this._evacuationFileStatus = value;
    }

    public getCurrentEvacuationFiles(): Array<NeedsAssessment> {
        return this.currentEvacuationFiles;
    }

    public setCurrentEvacuationFiles(evacuationFiles: Array<NeedsAssessment>): void {
        this.currentEvacuationFiles = evacuationFiles;
    }

    public getCurrentEvacuationFileCount(): Observable<number> {
        return this.currentEvacuationFileCount$;
    }

    public setCurrentEvacuationFileCount(count: number): void {
        this.currentEvacuationFileCount.next(count);
    }

    public getPastEvacuationFiles(): Array<NeedsAssessment> {
        return this.pastEvacuationFiles;
    }

    public setPastEvacuationFiles(evacuationFiles: Array<NeedsAssessment>): void {
        this.pastEvacuationFiles = evacuationFiles;
    }

    public getPastEvacuationFileCount(): number {
        return this.pastEvacuationFileCount;
    }

    public setPastEvacuationFileCount(count: number): void {
        this.pastEvacuationFileCount = count;
    }

    public createEvacuationFileDTO(): EvacuationFile {
        return {
            evacuatedFromAddress: this.setAddressObject(this.evacuatedFromAddress),
            needsAssessments: this.getNeedsAssessment(),
            evacuationFileDate: this.evacuationFileDate
        };
    }

    public createEvacuationFile(): Observable<string> {
        return this.evacuationService.evacuationCreateEvacuation({ body: this.createEvacuationFileDTO() });
    }

    private setAddressObject(addressObject): Address {
        const address: Address = {
            addressLine1: addressObject.addressLine1,
            addressLine2: addressObject.addressLine2,
            country: {
                code: addressObject.country.code,
                name: addressObject.country.name
            },
            jurisdiction: {
                code: addressObject.jurisdiction.code === undefined ?
                    null : addressObject.jurisdiction.code,
                name: addressObject.jurisdiction.name ===
                    undefined ? addressObject.jurisdiction : addressObject.jurisdiction.name
            },
            postalCode: addressObject.postalCode,
            stateProvince: {
                code: addressObject.stateProvince === null ?
                    addressObject.stateProvince : addressObject.stateProvince.code,
                name: addressObject.stateProvince === null ?
                    addressObject.stateProvince : addressObject.stateProvince.name
            }
        };

        return address;
    }

    private getNeedsAssessment(): Array<NeedsAssessment> {
        const needsAssessment: NeedsAssessment = this.needsAssessmentService.createNeedsAssessmentDTO();
        this._needsAssessments.splice(0, 1, needsAssessment);
        // console.log(this._needsAssessments);
        return this._needsAssessments;
    }

}
