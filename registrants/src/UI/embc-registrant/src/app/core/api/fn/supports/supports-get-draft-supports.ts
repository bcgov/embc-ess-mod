/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { DraftSupports } from '../../models/draft-supports';

export interface SupportsGetDraftSupports$Params {
  evacuationFileId: string;
}

export function supportsGetDraftSupports(
  http: HttpClient,
  rootUrl: string,
  params: SupportsGetDraftSupports$Params,
  context?: HttpContext
): Observable<StrictHttpResponse<DraftSupports>> {
  const rb = new RequestBuilder(rootUrl, supportsGetDraftSupports.PATH, 'get');
  if (params) {
    rb.path('evacuationFileId', params.evacuationFileId, {});
  }

  return http.request(rb.build({ responseType: 'json', accept: 'application/json', context })).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<DraftSupports>;
    })
  );
}

supportsGetDraftSupports.PATH = '/api/Evacuations/{evacuationFileId}/Supports/draft';
