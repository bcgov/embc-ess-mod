import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import {
  EvacueeDetailsModel,
  EvacueeSearchContextModel
} from '../core/models/evacuee-search-context.model';
import { EvacueeSearchResults } from '../core/models/evacuee-search-results';
import { EvacueeSearchService } from '../feature-components/search/evacuee-search/evacuee-search.service';

@Injectable({
  providedIn: 'root'
})
export class MockEvacueeSearchService extends EvacueeSearchService {
  public searchContextValue: EvacueeSearchContextModel;
  public paperBasedEssFileValue: string;
  public evacueeSearchResults: EvacueeSearchResults;

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

  public searchForEvacuee(
    evacueeSearchParameters: EvacueeDetailsModel
  ): Observable<EvacueeSearchResults> {
    return new BehaviorSubject<EvacueeSearchResults>(this.evacueeSearchResults);
  }
}
