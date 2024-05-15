import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import {
  EligibilityCheck,
  EvacuationFile,
  EvacuationFileStatus,
  NeedsAssessment,
  Support,
  SupportMethod
} from 'src/app/core/api/models';
import { EvacuationsService, ProfileService, SupportsService } from 'src/app/core/api/services';
import { RegAddress } from 'src/app/core/model/address';
import { EvacuationFileModel } from 'src/app/core/model/evacuation-file.model';
import { LocationService } from 'src/app/core/services/location.service';
import { ProfileDataService } from 'src/app/feature-components/profile/profile-data.service';
import { RestrictionService } from 'src/app/feature-components/restriction/restriction.service';
import { NeedsAssessmentService } from '../../../feature-components/needs-assessment/needs-assessment.service';

@Injectable({ providedIn: 'root' })
export class EvacuationFileDataService {
  currentEvacuationFileCount: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public currentEvacuationFileCount$: Observable<number> = this.currentEvacuationFileCount.asObservable();

  pastEvacuationFileCount: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public pastEvacuationFileCount$: Observable<number> = this.pastEvacuationFileCount.asObservable();

  hasPendingEssFiles: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public hasPendingEssFiles$: Observable<boolean> = this.hasPendingEssFiles.asObservable();

  allSupportsSelfServe: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public allSupportsSelfServe$: Observable<boolean> = this.allSupportsSelfServe.asObservable();

  hasMultipleActiveFiles: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public hasMultipleActiveFiles$: Observable<boolean> = this.hasMultipleActiveFiles.asObservable();

  private evacuatedAddressVal: RegAddress;
  private evacuationFileDateVal: string;
  private essFileIdVal: string;
  private externalReferenceIdVal: string;
  private isPaperVal: boolean;

  private secretPhraseVal: string;
  private secretPhraseEditedVal: boolean;
  private evacuationFileStatusVal: EvacuationFileStatus;

  private supportsVal: Array<Support>;

  public selfServeEligibilityCheck?: EligibilityCheck;

  constructor(
    private evacuationService: EvacuationsService,
    private needsAssessmentService: NeedsAssessmentService,
    private locationService: LocationService,
    private restrictionService: RestrictionService,
    private profileService: ProfileService,
    private profileDataService: ProfileDataService,
    private supportService: SupportsService
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

  public get externalReferenceId(): string {
    return this.externalReferenceIdVal;
  }
  public set externalReferenceId(value: string) {
    this.externalReferenceIdVal = value;
  }

  public get isPaper(): boolean {
    return this.isPaperVal;
  }
  public set isPaper(value: boolean) {
    this.isPaperVal = value;
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

  public get supports(): Array<Support> {
    return this.supportsVal;
  }
  public set supports(value: Array<Support>) {
    this.supportsVal = value;
  }

  public getCurrentEvacuationFileCount(): Observable<number> {
    return this.currentEvacuationFileCount$;
  }

  public setCurrentEvacuationFileCount(count: number): void {
    this.currentEvacuationFileCount.next(count);
  }

  public getPastEvacuationFileCount(): Observable<number> {
    return this.pastEvacuationFileCount$;
  }

  public setPastEvacuationFileCount(count: number): void {
    this.pastEvacuationFileCount.next(count);
  }

  public getHasPendingEssFiles(): Observable<boolean> {
    return this.hasPendingEssFiles$;
  }

  public setHasPendingEssFiles(evacuationFiles: Array<EvacuationFileModel>): void {
    const totalPendingFiles = evacuationFiles.filter((item) => item.status === EvacuationFileStatus.Pending).length;

    if (totalPendingFiles > 0) {
      this.hasPendingEssFiles.next(true);
    } else {
      this.hasPendingEssFiles.next(false);
    }
  }

  public getAllSupportsSelfServe(): Observable<boolean> {
    return this.allSupportsSelfServe$;
  }

  public setAllSupportsSelfServe(essFileData: EvacuationFileModel): void {
    if (essFileData === undefined || essFileData.supports === undefined || essFileData.supports.length === 0) {
      this.allSupportsSelfServe.next(false);
      return;
    }
    essFileData.supports.forEach((item: Support) => {
      if (item.isSelfServe !== true || item.method === SupportMethod.Referral) {
        this.allSupportsSelfServe.next(false);
        return;
      }
    });

    this.allSupportsSelfServe.next(true);
  }

  public getHasMultipleActiveFiles(): Observable<boolean> {
    return this.hasMultipleActiveFiles$;
  }

  public setHasMultipleActiveFiles(evacuationFiles: Array<EvacuationFileModel>): void {
    const totalActiveFiles = evacuationFiles.filter((item) => item.status === EvacuationFileStatus.Active).length;

    if (totalActiveFiles > 1) {
      this.hasMultipleActiveFiles.next(true);
    } else if (totalActiveFiles === 1) {
      let essFileData = evacuationFiles.find((item) => item.status === EvacuationFileStatus.Active);
      if (essFileData === undefined || essFileData.supports === undefined || essFileData.supports.length === 0) {
        this.hasMultipleActiveFiles.next(false);
        return;
      }
      if (essFileData.supports.length > 0) {
        this.hasMultipleActiveFiles.next(true);
        return;
      }
    }
    this.hasMultipleActiveFiles.next(false);
  }

  public createEvacuationFileDTO(): EvacuationFile {
    return {
      evacuatedFromAddress: this.locationService.setAddressObjectForDTO(this.evacuatedAddress),
      evacuationFileDate: this.evacuationFileDate,
      fileId: this.essFileId,
      isRestricted: this.restrictionService.restrictedAccess,
      needsAssessment: this.getNeedsAssessment(),
      secretPhrase: this.secretPhrase,
      secretPhraseEdited: this.secretPhraseEdited,
      status: this.evacuationFileStatus
    };
  }

  public updateRestriction(): Observable<string> {
    return this.profileService.profileUpsert({
      body: this.profileDataService.createProfileDTO()
    });
    // return this.profileService.upsertProfile(
    //   this.profileDataService.createProfileDTO()
    // );
  }

  public createEvacuationFile(): Observable<string> {
    return this.evacuationService
      .evacuationsUpsertEvacuationFile({ body: this.createEvacuationFileDTO() })
      .pipe(map((response) => response.referenceNumber));
  }

  public checkEligibleForSelfServeSupport(
    params: Parameters<SupportsService['supportsCheckSelfServeEligibility']>[0]
  ): ReturnType<SupportsService['supportsCheckSelfServeEligibility']> {
    return this.supportService
      .supportsCheckSelfServeEligibility(params)
      .pipe(tap((eligibilityCheck) => (this.selfServeEligibilityCheck = eligibilityCheck)));
  }

  public clearESSFileData(): void {
    this.evacuatedAddress = undefined;
    this.evacuationFileDate = undefined;
    this.essFileId = undefined;
    this.secretPhrase = undefined;
    this.secretPhraseEdited = undefined;
    this.evacuationFileStatus = undefined;
    this.supports = undefined;
    this.selfServeEligibilityCheck = undefined;
    this.needsAssessmentService.clearNeedsAssessmentData();
  }

  private getNeedsAssessment(): NeedsAssessment {
    const needsAssessment: NeedsAssessment = this.needsAssessmentService.createNeedsAssessmentDTO();
    return needsAssessment;
  }
}
