import { Injectable } from '@angular/core';
import { EvacuationFileHouseholdMember, NeedsAssessment } from '../api/models';
import { EvacuationFileModel } from '../models/evacuation-file.model';
import { FileLinkRequestModel } from '../models/fileLinkRequest.model';
import { CacheService } from './cache.service';

@Injectable({ providedIn: 'root' })
export class EvacueeSessionService {
  private securityQuestionsOpenedFromVal: string;
  private securityPhraseOpenedFromVal: string;
  private fileLinkFlagVal: string;
  private fileLinkMetaDataVal: FileLinkRequestModel;
  private fileLinkStatusVal: string;
  private memberRegistrationVal: EvacuationFileHouseholdMember;
  private isPaperBasedVal: boolean;
  private currentNeedsAssessmentVal: NeedsAssessment;
  private newHouseholdRegistrantIdVal: string;

  private evacFileVal: EvacuationFileModel;

  constructor(private cacheService: CacheService) {}

  set newHouseholdRegistrantId(newHouseholdRegistrantIdVal: string) {
    this.newHouseholdRegistrantIdVal = newHouseholdRegistrantIdVal;
  }

  get newHouseholdRegistrantId(): string {
    return this.newHouseholdRegistrantIdVal;
  }

  set currentNeedsAssessment(currentNeedsAssessmentVal: NeedsAssessment) {
    this.currentNeedsAssessmentVal = currentNeedsAssessmentVal;
  }

  get currentNeedsAssessment(): NeedsAssessment {
    return this.currentNeedsAssessmentVal;
  }

  set evacFile(evacFileVal: EvacuationFileModel) {
    this.evacFileVal = evacFileVal;
  }

  get evacFile(): EvacuationFileModel {
    return this.evacFileVal;
  }

  set memberRegistration(memberRegistrationVal: EvacuationFileHouseholdMember) {
    this.memberRegistrationVal = memberRegistrationVal;
    if (memberRegistrationVal !== null) {
      this.cacheService.set('memberRegistration', memberRegistrationVal);
    } else {
      this.cacheService.remove('memberRegistration');
    }
  }

  get memberRegistration(): EvacuationFileHouseholdMember {
    return this.memberRegistrationVal
      ? this.memberRegistrationVal
      : JSON.parse(this.cacheService.get('memberRegistration'));
  }

  set securityQuestionsOpenedFrom(securityQuestionsOpenedFromVal: string) {
    this.securityQuestionsOpenedFromVal = securityQuestionsOpenedFromVal;
    this.cacheService.set(
      'securityQuestionsOpenedFrom',
      securityQuestionsOpenedFromVal
    );
  }

  get securityQuestionsOpenedFrom(): string {
    return this.securityQuestionsOpenedFromVal
      ? this.securityQuestionsOpenedFromVal
      : this.cacheService.get('securityQuestionsOpenedFrom');
  }

  set securityPhraseOpenedFrom(securityPhraseOpenedFromVal: string) {
    this.securityPhraseOpenedFromVal = securityPhraseOpenedFromVal;
    this.cacheService.set(
      'securityPhraseOpenedFrom',
      securityPhraseOpenedFromVal
    );
  }

  get securityPhraseOpenedFrom(): string {
    return this.securityPhraseOpenedFromVal
      ? this.securityPhraseOpenedFromVal
      : this.cacheService.get('securityPhraseOpenedFrom');
  }

  get fileLinkStatus(): string {
    return this.fileLinkStatusVal
      ? this.fileLinkStatusVal
      : this.cacheService.get('fileLinkStatus');
  }

  set fileLinkStatus(fileLinkStatusVal: string) {
    this.fileLinkStatusVal = fileLinkStatusVal;
    if (fileLinkStatusVal !== null) {
      this.cacheService.set('fileLinkStatus', fileLinkStatusVal);
    } else {
      this.cacheService.remove('fileLinkStatus');
    }
  }

  get fileLinkFlag(): string {
    return this.fileLinkFlagVal
      ? this.fileLinkFlagVal
      : this.cacheService.get('fileLinkFlag');
  }

  set fileLinkFlag(fileLinkFlagVal: string) {
    this.fileLinkFlagVal = fileLinkFlagVal;
    if (fileLinkFlagVal !== null) {
      this.cacheService.set('fileLinkFlag', fileLinkFlagVal);
    } else {
      this.cacheService.remove('fileLinkFlag');
    }
  }

  get fileLinkMetaData(): FileLinkRequestModel {
    return this.fileLinkMetaDataVal
      ? this.fileLinkMetaDataVal
      : JSON.parse(this.cacheService.get('fileLinkMetaData'));
  }

  set fileLinkMetaData(fileLinkMetaDataVal: FileLinkRequestModel) {
    this.fileLinkMetaDataVal = fileLinkMetaDataVal;
    if (fileLinkMetaDataVal !== null) {
      this.cacheService.set('fileLinkMetaData', fileLinkMetaDataVal);
    } else {
      this.cacheService.remove('fileLinkMetaData');
    }
  }

  public get isPaperBased(): boolean {
    return this.isPaperBasedVal !== undefined
      ? this.isPaperBasedVal
      : JSON.parse(this.cacheService.get('paperBased'));
  }
  public set isPaperBased(value: boolean) {
    this.isPaperBasedVal = value;
    this.cacheService.set('paperBased', value);
  }

  clearEvacueeSession() {
    //this.profileId = null; --TODO
    //this.essFileNumber = null;
    this.newHouseholdRegistrantId = null;
    this.securityQuestionsOpenedFrom = null;
    this.securityPhraseOpenedFrom = null;
    this.fileLinkFlag = null;
    this.fileLinkStatus = null;
    this.fileLinkMetaData = null;
    this.memberRegistration = null;
    this.isPaperBased = null;
    this.cacheService.remove('registrantProfileId');
    this.cacheService.remove('fileNumber');
    this.cacheService.remove('evacueeSearchContext');
    this.cacheService.remove('essFile');
    this.cacheService.remove('securityQuestionsOpenedFrom');
    this.cacheService.remove('securityPhraseOpenedFrom');
    this.cacheService.remove('fileLinkFlag');
    this.cacheService.remove('fileLinkStatus');
    this.cacheService.remove('fileLinkMetaData');
    this.cacheService.remove('memberRegistration');
    this.cacheService.remove('paperBased');
  }
}
