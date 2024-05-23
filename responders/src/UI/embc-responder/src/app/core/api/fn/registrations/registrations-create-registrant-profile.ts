/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { RegistrantProfile } from '../../models/registrant-profile';
import { RegistrationResult } from '../../models/registration-result';

export interface RegistrationsCreateRegistrantProfile$Params {
  /**
   * Registrant
   */
  body: RegistrantProfile;
}

export function registrationsCreateRegistrantProfile(
  http: HttpClient,
  rootUrl: string,
  params: RegistrationsCreateRegistrantProfile$Params,
  context?: HttpContext
): Observable<StrictHttpResponse<RegistrationResult>> {
  const rb = new RequestBuilder(rootUrl, registrationsCreateRegistrantProfile.PATH, 'post');
  if (params) {
    rb.body(params.body, 'application/json');
  }

  return http.request(rb.build({ responseType: 'json', accept: 'application/json', context })).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<RegistrationResult>;
    })
  );
}

registrationsCreateRegistrantProfile.PATH = '/api/Registrations/registrants';
