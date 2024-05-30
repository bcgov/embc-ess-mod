/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { VerifySecurityQuestionsRequest } from '../../models/verify-security-questions-request';
import { VerifySecurityQuestionsResponse } from '../../models/verify-security-questions-response';

export interface RegistrationsVerifySecurityQuestions$Params {
  /**
   * registrant id
   */
  registrantId: string;

  /**
   * array of questions and their answers
   */
  body: VerifySecurityQuestionsRequest;
}

export function registrationsVerifySecurityQuestions(
  http: HttpClient,
  rootUrl: string,
  params: RegistrationsVerifySecurityQuestions$Params,
  context?: HttpContext
): Observable<StrictHttpResponse<VerifySecurityQuestionsResponse>> {
  const rb = new RequestBuilder(rootUrl, registrationsVerifySecurityQuestions.PATH, 'post');
  if (params) {
    rb.path('registrantId', params.registrantId, {});
    rb.body(params.body, 'application/json');
  }

  return http.request(rb.build({ responseType: 'json', accept: 'application/json', context })).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<VerifySecurityQuestionsResponse>;
    })
  );
}

registrationsVerifySecurityQuestions.PATH = '/api/Registrations/registrants/{registrantId}/security';
