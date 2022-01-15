import { Injectable } from '@angular/core';
import { EvacueeSearchService } from '../feature-components/search/evacuee-search/evacuee-search.service';

@Injectable({
  providedIn: 'root'
})
export class MockEvacueeSearchService extends EvacueeSearchService {
  public paperBasedValue: boolean;

  public get paperBased(): boolean {
    return this.paperBasedValue;
  }
  public set paperBased(value: boolean) {
    this.paperBasedValue = value;
  }
}
