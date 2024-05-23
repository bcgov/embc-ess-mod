/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

export interface ConfigurationGetSecurityQuestions$Params {}

export function configurationGetSecurityQuestions(
  http: HttpClient,
  rootUrl: string,
  params?: ConfigurationGetSecurityQuestions$Params,
  context?: HttpContext
): Observable<StrictHttpResponse<Array<string>>> {
  const rb = new RequestBuilder(rootUrl, configurationGetSecurityQuestions.PATH, 'get');
  if (params) {
  }

  return http.request(rb.build({ responseType: 'json', accept: 'application/json', context })).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Array<string>>;
    })
  );
}

configurationGetSecurityQuestions.PATH = '/api/Configuration/security-questions';
