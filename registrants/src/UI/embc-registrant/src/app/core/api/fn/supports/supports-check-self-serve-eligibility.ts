/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { EligibilityCheck } from '../../models/eligibility-check';

export interface SupportsCheckSelfServeEligibility$Params {
  evacuationFileId: string;
}

export function supportsCheckSelfServeEligibility(
  http: HttpClient,
  rootUrl: string,
  params: SupportsCheckSelfServeEligibility$Params,
  context?: HttpContext
): Observable<StrictHttpResponse<EligibilityCheck>> {
  const rb = new RequestBuilder(rootUrl, supportsCheckSelfServeEligibility.PATH, 'get');
  if (params) {
    rb.path('evacuationFileId', params.evacuationFileId, {});
  }

  return http.request(rb.build({ responseType: 'json', accept: 'application/json', context })).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<EligibilityCheck>;
    })
  );
}

supportsCheckSelfServeEligibility.PATH = '/api/Evacuations/{evacuationFileId}/Supports/eligible';
