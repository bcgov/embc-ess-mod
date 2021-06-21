import { Injectable } from '@angular/core';
import { CacheService } from './cache.service';

@Injectable({ providedIn: 'root' })
export class EvacueeSession {
  private registrantProfileId: string;
  //private registrantProfile: RegistrantProfile;
  //essFileNumber: string;

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

  clearEvacueeSession() {
    this.registrantProfileId = null;
    this.cacheService.remove('registrantProfileId');
  }
}
