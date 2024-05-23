/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { RegistrantProfile } from '../../models/registrant-profile';

export interface RegistrationsGetRegistrantProfile$Params {
  /**
   * RegistrantId
   */
  registrantId: string;
}

export function registrationsGetRegistrantProfile(
  http: HttpClient,
  rootUrl: string,
  params: RegistrationsGetRegistrantProfile$Params,
  context?: HttpContext
): Observable<StrictHttpResponse<RegistrantProfile>> {
  const rb = new RequestBuilder(rootUrl, registrationsGetRegistrantProfile.PATH, 'get');
  if (params) {
    rb.path('registrantId', params.registrantId, {});
  }

  return http.request(rb.build({ responseType: 'json', accept: 'application/json', context })).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<RegistrantProfile>;
    })
  );
}

registrationsGetRegistrantProfile.PATH = '/api/Registrations/registrants/{registrantId}';
