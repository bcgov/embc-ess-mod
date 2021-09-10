import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  Address,
  EvacuationFile,
  EvacuationFileStatus,
  NeedsAssessment
} from 'src/app/core/api/models';
import { EvacuationsService } from 'src/app/core/api/services';
import { RegAddress } from 'src/app/core/model/address';
import { LocationService } from 'src/app/core/services/location.service';
import { NeedsAssessmentService } from '../../../feature-components/needs-assessment/needs-assessment.service';

@Injectable({ providedIn: 'root' })
export class EvacuationFileDataService {
  currentEvacuationFileCount: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);
  public currentEvacuationFileCount$: Observable<number> =
    this.currentEvacuationFileCount.asObservable();

  pastEvacuationFileCount: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);
  public pastEvacuationFileCount$: Observable<number> =
    this.pastEvacuationFileCount.asObservable();

  private currentEvacuationFilesVal: Array<NeedsAssessment>;
  private pastEvacuationFilesVal: Array<NeedsAssessment>;

  private evacuatedAddressVal: RegAddress;
  private evacuationFileDateVal: string;
  private essFileIdVal: string;
  private isRestrictedVal: boolean;

  private secretPhraseVal: string;
  private secretPhraseEditedVal: boolean;
  private evacuationFileStatusVal: EvacuationFileStatus;

  constructor(
    private evacuationService: EvacuationsService,
    private needsAssessmentService: NeedsAssessmentService,
    private locationService: LocationService
  ) {}

  public get evacuatedAddress(): RegAddress {
    return this.evacuatedAddressVal;
  }
  public set evacuatedAddress(value: RegAddress) {
    this.evacuatedAddressVal = value;
  }

  public get evacuationFileDate(): string {
    return this.evacuationFileDateVal;
  }
  public set evacuationFileDate(value: string) {
    this.evacuationFileDateVal = value;
  }

  public get essFileId(): string {
    return this.essFileIdVal;
  }
  public set essFileId(value: string) {
    this.essFileIdVal = value;
  }

  public get isRestricted(): boolean {
    return this.isRestrictedVal;
  }
  public set isRestricted(value: boolean) {
    this.isRestrictedVal = value;
  }

  public get secretPhrase(): string {
    return this.secretPhraseVal;
  }
  public set secretPhrase(value: string) {
    this.secretPhraseVal = value;
  }

  public get secretPhraseEdited(): boolean {
    return this.secretPhraseEditedVal;
  }
  public set secretPhraseEdited(value: boolean) {
    this.secretPhraseEditedVal = value;
  }

  public get evacuationFileStatus(): EvacuationFileStatus {
    return this.evacuationFileStatusVal;
  }
  public set evacuationFileStatus(value: EvacuationFileStatus) {
    this.evacuationFileStatusVal = value;
  }

  public getCurrentEvacuationFileCount(): Observable<number> {
    return this.currentEvacuationFileCount$;
  }

  public setCurrentEvacuationFileCount(count: number): void {
    this.currentEvacuationFileCount.next(count);
  }

  public getCurrentEvacuationFiles(): Array<NeedsAssessment> {
    return this.currentEvacuationFilesVal;
  }

  public setCurrentEvacuationFiles(
    evacuationFiles: Array<NeedsAssessment>
  ): void {
    this.currentEvacuationFilesVal = evacuationFiles;
  }

  public getPastEvacuationFileCount(): Observable<number> {
    return this.pastEvacuationFileCount$;
  }

  public setPastEvacuationFileCount(count: number): void {
    this.pastEvacuationFileCount.next(count);
  }

  public getPastEvacuationFiles(): Array<NeedsAssessment> {
    return this.pastEvacuationFilesVal;
  }

  public setPastEvacuationFiles(evacuationFiles: Array<NeedsAssessment>): void {
    this.pastEvacuationFilesVal = evacuationFiles;
  }

  public createEvacuationFileDTO(): EvacuationFile {
    return {
      evacuatedFromAddress: this.locationService.setAddressObjectForDTO(
        this.evacuatedAddress
      ),
      evacuationFileDate: this.evacuationFileDate,
      fileId: this.essFileId,
      isRestricted: this.isRestricted,
      needsAssessment: this.getNeedsAssessment(),
      secretPhrase: this.secretPhrase,
      secretPhraseEdited: this.secretPhraseEdited,
      status: this.evacuationFileStatus
    };
  }

  public createEvacuationFile(): Observable<string> {
    return this.evacuationService
      .evacuationsUpsertEvacuationFile({ body: this.createEvacuationFileDTO() })
      .pipe(map((response) => response.referenceNumber));
  }

  // private setAddressObject(addressObject: RegAddress): Address {
  //   const address: Address = {
  //     addressLine1: addressObject.addressLine1,
  //     addressLine2: addressObject.addressLine2,
  //     country: addressObject.country.code,
  //     community:
  //       addressObject.community?.code === undefined
  //         ? null
  //         : addressObject.community?.code,
  //     postalCode: addressObject.postalCode,
  //     stateProvince:
  //       addressObject.stateProvince === null
  //         ? addressObject.stateProvince
  //         : addressObject.stateProvince.code
  //   };

  //   return address;
  // }

  private getNeedsAssessment(): NeedsAssessment {
    const needsAssessment: NeedsAssessment =
      this.needsAssessmentService.createNeedsAssessmentDTO();
    return needsAssessment;
  }
}
