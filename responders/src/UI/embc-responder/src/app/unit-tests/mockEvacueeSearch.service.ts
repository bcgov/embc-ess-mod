import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { EvacueeDetailsModel } from '../core/models/evacuee-search-context.model';
import { EvacueeSearchResults } from '../core/models/evacuee-search-results';
import { EvacueeSearchService } from '../feature-components/search/evacuee-search/evacuee-search.service';

@Injectable({
  providedIn: 'root'
})
export class MockEvacueeSearchService extends EvacueeSearchService {
  public evacueeSearchResults: EvacueeSearchResults;

  public searchForEvacuee(
    evacueeSearchParameters: EvacueeDetailsModel
  ): Observable<EvacueeSearchResults> {
    return new BehaviorSubject<EvacueeSearchResults>(this.evacueeSearchResults);
  }
}
