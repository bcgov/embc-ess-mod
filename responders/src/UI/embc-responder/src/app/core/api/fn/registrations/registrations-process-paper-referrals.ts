/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { ProcessPaperReferralsRequest } from '../../models/process-paper-referrals-request';

export interface RegistrationsProcessPaperReferrals$Params {
  fileId: string;
  body?: ProcessPaperReferralsRequest;
}

export function registrationsProcessPaperReferrals(
  http: HttpClient,
  rootUrl: string,
  params: RegistrationsProcessPaperReferrals$Params,
  context?: HttpContext
): Observable<StrictHttpResponse<void>> {
  const rb = new RequestBuilder(rootUrl, registrationsProcessPaperReferrals.PATH, 'post');
  if (params) {
    rb.path('fileId', params.fileId, {});
    rb.body(params.body, 'application/*+json');
  }

  return http.request(rb.build({ responseType: 'text', accept: '*/*', context })).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
    })
  );
}

registrationsProcessPaperReferrals.PATH = '/api/Registrations/files/{fileId}/paperreferrals';
