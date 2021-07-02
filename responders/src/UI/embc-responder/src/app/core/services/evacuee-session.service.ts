import { Injectable } from '@angular/core';
import { ignoreElements } from 'rxjs/operators';
import { CacheService } from './cache.service';

@Injectable({ providedIn: 'root' })
export class EvacueeSessionService {
  private profileIdVal: string;
  //private registrantProfile: RegistrantProfile;
  private essFileNumberVal: string;

  private editWizardFlag: boolean;

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

  clearEvacueeSession() {
    this.profileId = null;
    this.essFileNumber = null;
    this.cacheService.remove('registrantProfileId');
    this.cacheService.remove('fileNumber');
    this.cacheService.remove('wizardType');
    this.cacheService.remove('taskNumber');
  }

  public setWizardType(wizardType: string) {
    this.cacheService.set('wizardType', wizardType);

    if (
      wizardType === 'edit-registration' ||
      wizardType === 'review-file' ||
      wizardType === 'complete-file'
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
