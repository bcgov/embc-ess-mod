import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  CommunityType,
  EvacuationFileStatus,
  HouseholdMemberType,
  RegistrantStatus
} from '../core/api/models';
import { EvacueeDetailsModel } from '../core/models/evacuee-search-context.model';
import { EvacueeSearchResults } from '../core/models/evacuee-search-results';
import { EvacueeSearchResultsService } from '../feature-components/search/evacuee-search/evacuee-search-results/evacuee-search-results.service';

@Injectable({
  providedIn: 'root'
})
export class MockEvacueeSearchResultsService extends EvacueeSearchResultsService {
  public evacueeSearchResultsValue: EvacueeSearchResults;

  public searchForEvacuee(
    evacueeSearchParameters: EvacueeDetailsModel,
    paperBasedEssFile?: string
  ): Observable<EvacueeSearchResults> {
    return new BehaviorSubject<EvacueeSearchResults>(
      this.evacueeSearchResultsValue
    );
  }
}
