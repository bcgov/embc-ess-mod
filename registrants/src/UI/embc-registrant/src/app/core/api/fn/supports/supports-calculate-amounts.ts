/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { SelfServeClothingSupport } from '../../models/self-serve-clothing-support';
import { SelfServeFoodGroceriesSupport } from '../../models/self-serve-food-groceries-support';
import { SelfServeFoodRestaurantSupport } from '../../models/self-serve-food-restaurant-support';
import { SelfServeIncidentalsSupport } from '../../models/self-serve-incidentals-support';
import { SelfServeShelterAllowanceSupport } from '../../models/self-serve-shelter-allowance-support';

export interface SupportsCalculateAmounts$Params {
  evacuationFileId: string;
  body?: Array<
    | SelfServeShelterAllowanceSupport
    | SelfServeFoodGroceriesSupport
    | SelfServeFoodRestaurantSupport
    | SelfServeIncidentalsSupport
    | SelfServeClothingSupport
  >;
}

export function supportsCalculateAmounts(
  http: HttpClient,
  rootUrl: string,
  params: SupportsCalculateAmounts$Params,
  context?: HttpContext
): Observable<
  StrictHttpResponse<
    Array<
      | SelfServeShelterAllowanceSupport
      | SelfServeFoodGroceriesSupport
      | SelfServeFoodRestaurantSupport
      | SelfServeIncidentalsSupport
      | SelfServeClothingSupport
    >
  >
> {
  const rb = new RequestBuilder(rootUrl, supportsCalculateAmounts.PATH, 'post');
  if (params) {
    rb.path('evacuationFileId', params.evacuationFileId, {});
    rb.body(params.body, 'application/*+json');
  }

  return http.request(rb.build({ responseType: 'json', accept: 'application/json', context })).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<
        Array<
          | SelfServeShelterAllowanceSupport
          | SelfServeFoodGroceriesSupport
          | SelfServeFoodRestaurantSupport
          | SelfServeIncidentalsSupport
          | SelfServeClothingSupport
        >
      >;
    })
  );
}

supportsCalculateAmounts.PATH = '/api/Evacuations/{evacuationFileId}/Supports/draft';
