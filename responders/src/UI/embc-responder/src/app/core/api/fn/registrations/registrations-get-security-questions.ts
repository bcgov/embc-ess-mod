/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { GetSecurityQuestionsResponse } from '../../models/get-security-questions-response';

export interface RegistrationsGetSecurityQuestions$Params {
  /**
   * registrant id
   */
  registrantId: string;
}

export function registrationsGetSecurityQuestions(
  http: HttpClient,
  rootUrl: string,
  params: RegistrationsGetSecurityQuestions$Params,
  context?: HttpContext
): Observable<StrictHttpResponse<GetSecurityQuestionsResponse>> {
  const rb = new RequestBuilder(rootUrl, registrationsGetSecurityQuestions.PATH, 'get');
  if (params) {
    rb.path('registrantId', params.registrantId, {});
  }

  return http.request(rb.build({ responseType: 'json', accept: 'application/json', context })).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<GetSecurityQuestionsResponse>;
    })
  );
}

registrationsGetSecurityQuestions.PATH = '/api/Registrations/registrants/{registrantId}/security';
