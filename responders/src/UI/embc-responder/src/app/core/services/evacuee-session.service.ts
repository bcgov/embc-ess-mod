import { Injectable } from '@angular/core';
import { EvacuationFileHouseholdMember } from '../api/models';
import { FileLinkRequestModel } from '../models/fileLinkRequest.model';
import { WizardType } from '../models/wizard-type.model';
import { CacheService } from './cache.service';

@Injectable({ providedIn: 'root' })
export class EvacueeSessionService {
  private profileIdVal: string;
  private essFileNumberVal: string;
  private securityQuestionsOpenedFromVal: string;
  private securityPhraseOpenedFromVal: string;
  private editWizardFlag: boolean;
  private fileLinkFlagVal: string;
  private fileLinkMetaDataVal: FileLinkRequestModel;
  private fileLinkStatusVal: string;
  private memberRegistrationVal: EvacuationFileHouseholdMember;
  private memberFlag: boolean;
  private paperBasedVal: boolean;

  constructor(private cacheService: CacheService) {}

  set profileId(profileIdVal: string) {
    this.profileIdVal = profileIdVal;
    if (profileIdVal !== null) {
      this.cacheService.set('registrantProfileId', profileIdVal);
    } else {
      this.cacheService.remove('registrantProfileId');
    }
  }

  get profileId(): string {
    return this.profileIdVal
      ? this.profileIdVal
      : this.cacheService.get('registrantProfileId');
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

  set essFileNumber(essFileNumberVal: string) {
    this.essFileNumberVal = essFileNumberVal;
    if (essFileNumberVal !== null) {
      this.cacheService.set('fileNumber', essFileNumberVal);
    } else {
      this.cacheService.remove('fileNumber');
    }
  }

  get essFileNumber(): string {
    return this.essFileNumberVal
      ? this.essFileNumberVal
      : this.cacheService.get('fileNumber');
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

  public get paperBased(): boolean {
    return this.paperBasedVal !== undefined
      ? this.paperBasedVal
      : JSON.parse(this.cacheService.get('paperBased'));
  }
  public set paperBased(value: boolean) {
    this.paperBasedVal = value;
    this.cacheService.set('paperBased', value);
  }

  clearEvacueeSession() {
    this.profileId = null;
    this.essFileNumber = null;
    this.securityQuestionsOpenedFrom = null;
    this.securityPhraseOpenedFrom = null;
    this.fileLinkFlag = null;
    this.fileLinkStatus = null;
    this.fileLinkMetaData = null;
    this.memberRegistration = null;
    this.editWizardFlag = null;
    this.memberFlag = null;
    this.paperBased = null;
    this.cacheService.remove('registrantProfileId');
    this.cacheService.remove('fileNumber');
    this.cacheService.remove('wizardType');
    this.cacheService.remove('evacueeSearchContext');
    this.cacheService.remove('essFile');
    this.cacheService.remove('securityQuestionsOpenedFrom');
    this.cacheService.remove('securityPhraseOpenedFrom');
    this.cacheService.remove('fileLinkFlag');
    this.cacheService.remove('fileLinkStatus');
    this.cacheService.remove('fileLinkMetaData');
    this.cacheService.remove('memberRegistration');
    this.cacheService.remove('editWizardFlag');
    this.cacheService.remove('memberFlag');
    this.cacheService.remove('paperBased');
  }

  public setWizardType(wizardType: string) {
    this.cacheService.set('wizardType', wizardType);

    if (
      wizardType === WizardType.EditRegistration ||
      wizardType === WizardType.ReviewFile ||
      wizardType === WizardType.CompleteFile
    ) {
      this.setEditWizardFlag(true);
    } else if (wizardType === WizardType.MemberRegistration) {
      this.setEditWizardFlag(false);
      this.setMemberFlag(true);
    } else {
      this.setEditWizardFlag(false);
    }
  }

  public getWizardType(): string {
    return this.cacheService.get('wizardType');
  }

  public getEditWizardFlag(): boolean {
    return this.editWizardFlag
      ? this.editWizardFlag
      : JSON.parse(this.cacheService.get('editWizardFlag'));
  }

  public setEditWizardFlag(editWizardFlag: boolean) {
    this.editWizardFlag = editWizardFlag;
    if (editWizardFlag !== null) {
      this.cacheService.set('editWizardFlag', editWizardFlag);
    } else {
      this.cacheService.remove('editWizardFlag');
    }
  }

  public getMemberFlag(): boolean {
    return this.memberFlag
      ? this.memberFlag
      : JSON.parse(this.cacheService.get('memberFlag'));
  }

  public setMemberFlag(memberFlag: boolean) {
    this.memberFlag = memberFlag;
    if (memberFlag !== null) {
      this.cacheService.set('memberFlag', memberFlag);
    } else {
      this.cacheService.remove('memberFlag');
    }
  }
}
