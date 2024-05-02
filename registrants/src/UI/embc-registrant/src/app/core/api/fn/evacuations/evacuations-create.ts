/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { AnonymousRegistration } from '../../models/anonymous-registration';
import { RegistrationResult } from '../../models/registration-result';

export interface EvacuationsCreate$Params {
  body?: AnonymousRegistration;
}

export function evacuationsCreate(
  http: HttpClient,
  rootUrl: string,
  params?: EvacuationsCreate$Params,
  context?: HttpContext
): Observable<StrictHttpResponse<RegistrationResult>> {
  const rb = new RequestBuilder(rootUrl, evacuationsCreate.PATH, 'post');
  if (params) {
    rb.body(params.body, 'application/*+json');
  }

  return http.request(rb.build({ responseType: 'json', accept: 'application/json', context })).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<RegistrationResult>;
    })
  );
}

evacuationsCreate.PATH = '/api/Evacuations/create-registration-anonymous';
