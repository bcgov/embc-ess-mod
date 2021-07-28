import { Injectable } from '@angular/core';
import { FileLinkRequestModel } from '../models/fileLinkRequest.model';
import { WizardType } from '../models/wizard-type.model';
import { CacheService } from './cache.service';

@Injectable({ providedIn: 'root' })
export class EvacueeSessionService {
  private profileIdVal: string;
  private essFileNumberVal: string;
  private securityQuestionsOpenedFromVal: string;
  private editWizardFlag: boolean;
  private fileLinkFlagVal: string;
  private fileLinkMetaDataVal: FileLinkRequestModel;

  constructor(private cacheService: CacheService) {}

  set profileId(profileIdVal: string) {
    this.profileIdVal = profileIdVal;
    this.cacheService.set('registrantProfileId', profileIdVal);
  }

  get profileId(): string {
    return this.profileIdVal
      ? this.profileIdVal
      : this.cacheService.get('registrantProfileId');
  }

  set essFileNumber(essFileNumberVal: string) {
    this.essFileNumberVal = essFileNumberVal;
    this.cacheService.set('fileNumber', essFileNumberVal);
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

  get fileLinkFlag(): string {
    return this.fileLinkFlagVal
      ? this.fileLinkFlagVal
      : this.cacheService.get('fileLinkFlag');
  }

  set fileLinkFlag(fileLinkFlagVal: string) {
    this.fileLinkFlagVal = fileLinkFlagVal;
    this.cacheService.set('fileLinkFlag', fileLinkFlagVal);
  }

  get fileLinkMetaData(): FileLinkRequestModel {
    return this.fileLinkMetaDataVal
      ? this.fileLinkMetaDataVal
      : JSON.parse(this.cacheService.get('fileLinkMetaData'));
  }

  set fileLinkMetaData(fileLinkMetaDataVal: FileLinkRequestModel) {
    this.fileLinkMetaDataVal = fileLinkMetaDataVal;
    this.cacheService.set('fileLinkMetaData', fileLinkMetaDataVal);
  }

  clearEvacueeSession() {
    this.profileId = null;
    this.essFileNumber = null;
    this.cacheService.remove('registrantProfileId');
    this.cacheService.remove('fileNumber');
    this.cacheService.remove('wizardType');
    this.cacheService.remove('evacueeSearchContext');
    this.cacheService.remove('essFile');
    this.cacheService.remove('securityQuestionsOpenedFrom');
    this.cacheService.remove('fileLinkFlag');
  }

  public setWizardType(wizardType: string) {
    this.cacheService.set('wizardType', wizardType);

    if (
      wizardType === WizardType.EditRegistration ||
      wizardType === WizardType.ReviewFile ||
      wizardType === WizardType.CompleteFile
    ) {
      this.editWizardFlag = true;
    } else {
      this.editWizardFlag = false;
    }
  }

  public getWizardType(): string {
    return this.cacheService.get('wizardType');
  }

  public getEditWizardFlag(): boolean {
    return this.editWizardFlag;
  }
}
