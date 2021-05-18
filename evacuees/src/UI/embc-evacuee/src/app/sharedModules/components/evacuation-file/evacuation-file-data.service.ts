import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  Address,
  EvacuationFile,
  NeedsAssessment,
} from 'src/app/core/api/models';
import { EvacuationsService } from 'src/app/core/api/services';
import { NeedsAssessmentService } from '../needs-assessment/needs-assessment.service';

@Injectable({ providedIn: 'root' })
export class EvacuationFileDataService {
  currentEvacuationFileCount: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);
  public currentEvacuationFileCount$: Observable<number> =
    this.currentEvacuationFileCount.asObservable();
  private essFilenumber: string;
  private evacuatedFromAddres: Address;
  private evacuationFiledate: string;
  private needAssessments: Array<NeedsAssessment> = [];
  private evacuationFilesStatus: string;
  private currentEvacuationFiles: Array<NeedsAssessment>;
  private pastEvacuationFiles: Array<NeedsAssessment>;
  private pastEvacuationFileCount: number;

  constructor(
    private evacuationService: EvacuationsService,
    private needsAssessmentService: NeedsAssessmentService
  ) {}

  public get essFileNumber(): string {
    return this.essFilenumber;
  }
  public set essFileNumber(value: string) {
    this.essFilenumber = value;
  }

  public get evacuationFileDate(): string {
    return this.evacuationFiledate;
  }
  public set evacuationFileDate(value: string) {
    this.evacuationFiledate = value;
  }

  public get evacuatedFromAddress(): Address {
    return this.evacuatedFromAddres;
  }
  public set evacuatedFromAddress(value: Address) {
    this.evacuatedFromAddres = value;
  }

  public get evacuationFileStatus(): string {
    return this.evacuationFilesStatus;
  }
  public set evacuationFileStatus(value: string) {
    this.evacuationFilesStatus = value;
  }

  public getCurrentEvacuationFiles(): Array<NeedsAssessment> {
    return this.currentEvacuationFiles;
  }

  public setCurrentEvacuationFiles(
    evacuationFiles: Array<NeedsAssessment>
  ): void {
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
      essFileNumber: this.essFilenumber,
      evacuatedFromAddress: this.setAddressObject(this.evacuatedFromAddress),
      needsAssessments: this.getNeedsAssessment(),
      evacuationFileDate: this.evacuationFileDate,
    };
  }

  public createEvacuationFile(): Observable<string> {
    return this.evacuationService
      .evacuationsUpsertEvacuationFile({ body: this.createEvacuationFileDTO() })
      .pipe(map((response) => response.referenceNumber));
  }

  private setAddressObject(addressObject): Address {
    const address: Address = {
      addressLine1: addressObject.addressLine1,
      addressLine2: addressObject.addressLine2,
      country: addressObject.country.code,
      jurisdiction:
        addressObject.jurisdiction.code === undefined
          ? null
          : addressObject.jurisdiction.code,
      postalCode: addressObject.postalCode,
      stateProvince:
        addressObject.stateProvince === null
          ? addressObject.stateProvince
          : addressObject.stateProvince.code,
    };

    return address;
  }

  private getNeedsAssessment(): Array<NeedsAssessment> {
    const needsAssessment: NeedsAssessment =
      this.needsAssessmentService.createNeedsAssessmentDTO();
    this.needAssessments.splice(0, 1, needsAssessment);
    return this.needAssessments;
  }
}
