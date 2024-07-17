/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { AuditAccessRequest } from '../../models/audit-access-request';

export interface RegistrationsAuditFileAcccess$Params {
  fileId: string;
  body?: AuditAccessRequest;
}

export function registrationsAuditFileAcccess(
  http: HttpClient,
  rootUrl: string,
  params: RegistrationsAuditFileAcccess$Params,
  context?: HttpContext
): Observable<StrictHttpResponse<void>> {
  const rb = new RequestBuilder(rootUrl, registrationsAuditFileAcccess.PATH, 'post');
  if (params) {
    rb.path('fileId', params.fileId, {});
    rb.body(params.body, 'application/*+json');
  }

  return http.request(rb.build({ responseType: 'text', accept: '*/*', context })).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
    })
  );
}

registrationsAuditFileAcccess.PATH = '/api/Registrations/files/{fileId}/access';
