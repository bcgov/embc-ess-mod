import { Injectable } from '@angular/core';
import { EvacueeSearchContextModel } from 'src/app/core/models/evacuee-search-context.model';
import { CacheService } from 'src/app/core/services/cache.service';

@Injectable({
  providedIn: 'root'
})
export class EvacueeSearchService {
  private searchContext: EvacueeSearchContextModel;

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

  public clearEvacueeSearch(): void {
    this.evacueeSearchContext = {
      evacueeSearchParameters: null,
      hasShownIdentification: null
    };
  }
}
