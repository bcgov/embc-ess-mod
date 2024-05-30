/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { RegistrantLinkRequest } from '../../models/registrant-link-request';

export interface RegistrationsLinkRegistrantToHouseholdMember$Params {
  fileId: string;
  body: RegistrantLinkRequest;
}

export function registrationsLinkRegistrantToHouseholdMember(
  http: HttpClient,
  rootUrl: string,
  params: RegistrationsLinkRegistrantToHouseholdMember$Params,
  context?: HttpContext
): Observable<StrictHttpResponse<string>> {
  const rb = new RequestBuilder(rootUrl, registrationsLinkRegistrantToHouseholdMember.PATH, 'post');
  if (params) {
    rb.path('fileId', params.fileId, {});
    rb.body(params.body, 'application/json');
  }

  return http.request(rb.build({ responseType: 'json', accept: 'application/json', context })).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<string>;
    })
  );
}

registrationsLinkRegistrantToHouseholdMember.PATH = '/api/Registrations/files/{fileId}/link';
