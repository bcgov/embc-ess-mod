import { Injectable } from '@angular/core';
import { ignoreElements } from 'rxjs/operators';
import { CacheService } from './cache.service';

@Injectable({ providedIn: 'root' })
export class EvacueeSessionService {
  private registrantProfileId: string;
  //private registrantProfile: RegistrantProfile;
  private fileNumber: string;
  private editWizardFlag: boolean;

  constructor(private cacheService: CacheService) {}

  set profileId(registrantProfileId: string) {
    this.registrantProfileId = registrantProfileId;
    this.cacheService.set('registrantProfileId', registrantProfileId);
  }

  get profileId(): string {
    return this.registrantProfileId
      ? this.registrantProfileId
      : this.cacheService.get('registrantProfileId');
  }

  set essFileNumber(fileNumber: string) {
    this.fileNumber = fileNumber;
    this.cacheService.set('fileNumber', fileNumber);
  }

  get essFileNumber(): string {
    return this.fileNumber
      ? this.fileNumber
      : this.cacheService.get('fileNumber');
  }

  clearEvacueeSession() {
    this.registrantProfileId = null;
    this.cacheService.remove('registrantProfileId');
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
