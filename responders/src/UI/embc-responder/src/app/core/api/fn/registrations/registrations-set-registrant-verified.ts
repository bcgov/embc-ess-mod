/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { RegistrationResult } from '../../models/registration-result';

export interface RegistrationsSetRegistrantVerified$Params {
  /**
   * RegistrantId
   */
  registrantId: string;

  /**
   * Verified
   */
  verified: boolean;
}

export function registrationsSetRegistrantVerified(
  http: HttpClient,
  rootUrl: string,
  params: RegistrationsSetRegistrantVerified$Params,
  context?: HttpContext
): Observable<StrictHttpResponse<RegistrationResult>> {
  const rb = new RequestBuilder(rootUrl, registrationsSetRegistrantVerified.PATH, 'post');
  if (params) {
    rb.path('registrantId', params.registrantId, {});
    rb.path('verified', params.verified, {});
  }

  return http.request(rb.build({ responseType: 'json', accept: 'application/json', context })).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<RegistrationResult>;
    })
  );
}

registrationsSetRegistrantVerified.PATH = '/api/Registrations/registrants/{registrantId}/verified/{verified}';
