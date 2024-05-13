/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { GetSecurityPhraseResponse } from '../../models/get-security-phrase-response';

export interface RegistrationsGetSecurityPhrase$Params {
  /**
   * file id
   */
  fileId: string;
}

export function registrationsGetSecurityPhrase(
  http: HttpClient,
  rootUrl: string,
  params: RegistrationsGetSecurityPhrase$Params,
  context?: HttpContext
): Observable<StrictHttpResponse<GetSecurityPhraseResponse>> {
  const rb = new RequestBuilder(rootUrl, registrationsGetSecurityPhrase.PATH, 'get');
  if (params) {
    rb.path('fileId', params.fileId, {});
  }

  return http.request(rb.build({ responseType: 'json', accept: 'application/json', context })).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<GetSecurityPhraseResponse>;
    })
  );
}

registrationsGetSecurityPhrase.PATH = '/api/Registrations/files/{fileId}/security';
