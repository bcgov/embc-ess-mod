import { Injectable } from '@angular/core';
import { CacheService } from './cache.service';

@Injectable({ providedIn: 'root' })
export class AppSessionService {
  private editParentPageVal: string;

  constructor(private cacheService: CacheService) {}

  public get editParentPage(): string {
    return this.editParentPageVal
      ? this.editParentPageVal
      : this.cacheService.get('editParentPage');
  }
  public set editParentPage(value: string) {
    this.editParentPageVal = value;
    this.cacheService.set('editParentPage', value);
  }
}
