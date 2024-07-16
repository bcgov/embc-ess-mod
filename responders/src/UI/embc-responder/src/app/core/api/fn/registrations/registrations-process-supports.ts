/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { ProcessDigitalSupportsRequest } from '../../models/process-digital-supports-request';
import { ReferralPrintRequestResponse } from '../../models/referral-print-request-response';

export interface RegistrationsProcessSupports$Params {
  fileId: string;
  body?: ProcessDigitalSupportsRequest;
}

export function registrationsProcessSupports(
  http: HttpClient,
  rootUrl: string,
  params: RegistrationsProcessSupports$Params,
  context?: HttpContext
): Observable<StrictHttpResponse<ReferralPrintRequestResponse>> {
  const rb = new RequestBuilder(rootUrl, registrationsProcessSupports.PATH, 'post');
  if (params) {
    rb.path('fileId', params.fileId, {});
    rb.body(params.body, 'application/*+json');
  }

  return http.request(rb.build({ responseType: 'json', accept: 'application/json', context })).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<ReferralPrintRequestResponse>;
    })
  );
}

registrationsProcessSupports.PATH = '/api/Registrations/files/{fileId}/supports';
