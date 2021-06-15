import { Injectable } from '@angular/core';
import { EvacueeSearchContextModel } from 'src/app/core/models/evacuee-search-context.model';
import { CacheService } from 'src/app/core/services/cache.service';

@Injectable({
  providedIn: 'root'
})
export class EvacueeSearchService {
  private searchContext: EvacueeSearchContextModel;
  private profileIdVal: string;
  private essFileIdVal: string;

  constructor(private cacheService: CacheService) {}

  public get evacueeSearchContext(): EvacueeSearchContextModel {
    return this.searchContext === null || this.searchContext === undefined
      ? JSON.parse(this.cacheService.get('evacueeSearchContext'))
      : this.searchContext;
  }

  public set evacueeSearchContext(searchContext: EvacueeSearchContextModel) {
    this.searchContext = {
      ...this.searchContext,
      ...searchContext
    };
    this.cacheService.set('evacueeSearchContext', this.searchContext);
  }

  public get profileId(): string {
    return this.profileIdVal;
  }

  public set profileId(profileIdVal: string) {
    this.profileIdVal = profileIdVal;
  }

  public get essFileId(): string {
    return this.essFileIdVal;
  }

  public set essFileId(essFileIdVal: string) {
    this.essFileIdVal = essFileIdVal;
  }
}
