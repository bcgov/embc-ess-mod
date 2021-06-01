import { Injectable } from '@angular/core';
import { EvacueeSearchContextModel } from 'src/app/core/models/evacuee-search-context.model';
import { CacheService } from 'src/app/core/services/cache.service';

@Injectable({
  providedIn: 'root'
})
export class EvacueeSearchService {
  evacueeSearchContext: EvacueeSearchContextModel;

  constructor(private cacheService: CacheService) {}

  public getEvacueeSearchContext(): EvacueeSearchContextModel {
    return this.evacueeSearchContext === null ||
      this.evacueeSearchContext === undefined
      ? JSON.parse(this.cacheService.get('evacueeSearchContext'))
      : this.evacueeSearchContext;
  }

  public setEvacueeSearchContext(
    evacueeSearchContext: EvacueeSearchContextModel
  ): void {
    this.evacueeSearchContext = {
      ...this.evacueeSearchContext,
      ...evacueeSearchContext
    };
    this.cacheService.set('evacueeSearchContext', this.evacueeSearchContext);
  }
}
