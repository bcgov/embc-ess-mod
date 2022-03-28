import { Injectable } from '@angular/core';
import { EvacueeSearchContextModel } from 'src/app/core/models/evacuee-search-context.model';
import { CacheService } from 'src/app/core/services/cache.service';

@Injectable({
  providedIn: 'root'
})
export class EvacueeSearchService {
  private searchContext: EvacueeSearchContextModel;
  private paperBasedEssFileVal: string;

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

  public get paperBasedEssFile(): string {
    return this.paperBasedEssFileVal
      ? this.paperBasedEssFileVal
      : this.cacheService.get('paperBasedEssFile');
  }

  public set paperBasedEssFile(paperBasedEssFileVal: string) {
    this.paperBasedEssFileVal = paperBasedEssFileVal;
    this.cacheService.set('paperBasedEssFile', paperBasedEssFileVal);
  }

  public clearEvacueeSearch(): void {
    this.evacueeSearchContext = undefined;
    this.paperBasedEssFile = undefined;
  }
}
