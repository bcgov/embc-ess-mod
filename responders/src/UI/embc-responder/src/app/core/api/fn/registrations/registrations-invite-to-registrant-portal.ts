/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { InviteRequest } from '../../models/invite-request';

export interface RegistrationsInviteToRegistrantPortal$Params {
  registrantId: string;
  body: InviteRequest;
}

export function registrationsInviteToRegistrantPortal(
  http: HttpClient,
  rootUrl: string,
  params: RegistrationsInviteToRegistrantPortal$Params,
  context?: HttpContext
): Observable<StrictHttpResponse<void>> {
  const rb = new RequestBuilder(rootUrl, registrationsInviteToRegistrantPortal.PATH, 'post');
  if (params) {
    rb.path('registrantId', params.registrantId, {});
    rb.body(params.body, 'application/json');
  }

  return http.request(rb.build({ responseType: 'text', accept: '*/*', context })).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
    })
  );
}

registrationsInviteToRegistrantPortal.PATH = '/api/Registrations/registrants/{registrantId}/invite';
