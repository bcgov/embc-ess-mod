/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

export interface SupportsOptOut$Params {
  evacuationFileId: string;
}

export function supportsOptOut(
  http: HttpClient,
  rootUrl: string,
  params: SupportsOptOut$Params,
  context?: HttpContext
): Observable<StrictHttpResponse<void>> {
  const rb = new RequestBuilder(rootUrl, supportsOptOut.PATH, 'post');
  if (params) {
    rb.path('evacuationFileId', params.evacuationFileId, {});
  }

  return http.request(rb.build({ responseType: 'text', accept: '*/*', context })).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
    })
  );
}

supportsOptOut.PATH = '/api/Evacuations/{evacuationFileId}/Supports/optout';
