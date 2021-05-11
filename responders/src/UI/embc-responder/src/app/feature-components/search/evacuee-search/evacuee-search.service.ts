import { Injectable } from '@angular/core';
import {
  EvacueeDetailsModel,
  EvacueeSearchContextModel
} from 'src/app/core/models/evacuee-search-context.model';
import { CacheService } from 'src/app/core/services/cache.service';

@Injectable({
  providedIn: 'root'
})
export class EvacueeSearchService {
  evacueeSearchContext: EvacueeSearchContextModel;

  constructor(private cacheService: CacheService) {}

  public getEvacueeSearchContext(): EvacueeSearchContextModel {
    return this.evacueeSearchContext === null
      ? JSON.parse(this.cacheService.get('evacueeSearchContext'))
      : this.evacueeSearchContext;
  }

  public setEvacueeSearchContext(
    evacueeSearchContext: EvacueeSearchContextModel
  ): void {
    this.cacheService.set('evacueeSearchContext', evacueeSearchContext);
    this.evacueeSearchContext = evacueeSearchContext;
  }

  // private hasShownIdentification: boolean;
  // private evacueeSearchParameters: EvacueeDetailsModel = {
  //   firstName: null,
  //   lastName: null,
  //   dateOfBirth: null
  // };

  // public getHasShownIdentification(): boolean {
  //   return this.hasShownIdentification;
  // }

  // public setHasShownIdentification(value: boolean): void {
  //   this.hasShownIdentification = value;
  // }

  // public getEvacueeSearchParameters(): EvacueeDetailsModel {
  //   return this.evacueeSearchParameters;
  // }

  // public setEvacueeSearchParameters(value: EvacueeDetailsModel): void {
  //   this.evacueeSearchParameters = value;
  // }

  // public getEvacueeSearchContext(): EvacueeSearchContextModel {
  //   return {
  //     hasShownIdentification: this.hasShownIdentification,
  //     evacueeSearchParameters: this.evacueeSearchParameters
  //   };
  //}
}
