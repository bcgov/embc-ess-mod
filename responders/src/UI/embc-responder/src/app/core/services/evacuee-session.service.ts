import { Injectable } from '@angular/core';
import { CacheService } from './cache.service';

@Injectable({ providedIn: 'root' })
export class EvacueeSessionService {
  private registrantProfileId: string;
  //private registrantProfile: RegistrantProfile;
  private fileNumber: string;

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
}
