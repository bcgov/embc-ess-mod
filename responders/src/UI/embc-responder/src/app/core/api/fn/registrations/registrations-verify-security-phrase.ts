/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { VerifySecurityPhraseRequest } from '../../models/verify-security-phrase-request';
import { VerifySecurityPhraseResponse } from '../../models/verify-security-phrase-response';

export interface RegistrationsVerifySecurityPhrase$Params {
  /**
   * file id
   */
  fileId: string;

  /**
   * security phrase to verify
   */
  body: VerifySecurityPhraseRequest;
}

export function registrationsVerifySecurityPhrase(
  http: HttpClient,
  rootUrl: string,
  params: RegistrationsVerifySecurityPhrase$Params,
  context?: HttpContext
): Observable<StrictHttpResponse<VerifySecurityPhraseResponse>> {
  const rb = new RequestBuilder(rootUrl, registrationsVerifySecurityPhrase.PATH, 'post');
  if (params) {
    rb.path('fileId', params.fileId, {});
    rb.body(params.body, 'application/json');
  }

  return http.request(rb.build({ responseType: 'json', accept: 'application/json', context })).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<VerifySecurityPhraseResponse>;
    })
  );
}

registrationsVerifySecurityPhrase.PATH = '/api/Registrations/files/{fileId}/security';
