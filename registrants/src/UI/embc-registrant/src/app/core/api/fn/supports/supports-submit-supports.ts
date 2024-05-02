/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { SubmitSupportsRequest } from '../../models/submit-supports-request';

export interface SupportsSubmitSupports$Params {
  evacuationFileId: string;
  body?: SubmitSupportsRequest;
}

export function supportsSubmitSupports(
  http: HttpClient,
  rootUrl: string,
  params: SupportsSubmitSupports$Params,
  context?: HttpContext
): Observable<StrictHttpResponse<void>> {
  const rb = new RequestBuilder(rootUrl, supportsSubmitSupports.PATH, 'post');
  if (params) {
    rb.path('evacuationFileId', params.evacuationFileId, {});
    rb.body(params.body, 'application/*+json');
  }

  return http.request(rb.build({ responseType: 'text', accept: '*/*', context })).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
    })
  );
}

supportsSubmitSupports.PATH = '/api/Evacuations/{evacuationFileId}/Supports';
