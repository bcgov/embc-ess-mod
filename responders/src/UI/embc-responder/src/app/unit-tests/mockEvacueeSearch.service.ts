import { Injectable } from '@angular/core';
import { EvacueeSearchContextModel } from '../core/models/evacuee-search-context.model';
import { EvacueeSearchService } from '../feature-components/search/evacuee-search/evacuee-search.service';

@Injectable({
  providedIn: 'root'
})
export class MockEvacueeSearchService extends EvacueeSearchService {
  public searchContextValue: EvacueeSearchContextModel;
  public paperBasedEssFileValue: string;

  public set evacueeSearchContext(value: EvacueeSearchContextModel) {
    this.searchContextValue = value;
  }

  public get evacueeSearchContext(): EvacueeSearchContextModel {
    return this.searchContextValue;
  }

  public set paperBasedEssFile(value: string) {
    this.paperBasedEssFileValue = value;
  }

  public get paperBasedEssFile(): string {
    return this.paperBasedEssFileValue;
  }
}
