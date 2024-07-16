/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { SupportVoidReason } from '../../models/support-void-reason';

export interface RegistrationsVoidSupport$Params {
  fileId: string;
  supportId: string;
  voidReason?: SupportVoidReason;
}

export function registrationsVoidSupport(
  http: HttpClient,
  rootUrl: string,
  params: RegistrationsVoidSupport$Params,
  context?: HttpContext
): Observable<StrictHttpResponse<void>> {
  const rb = new RequestBuilder(rootUrl, registrationsVoidSupport.PATH, 'post');
  if (params) {
    rb.path('fileId', params.fileId, {});
    rb.path('supportId', params.supportId, {});
    rb.query('voidReason', params.voidReason, {});
  }

  return http.request(rb.build({ responseType: 'text', accept: '*/*', context })).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
    })
  );
}

registrationsVoidSupport.PATH = '/api/Registrations/files/{fileId}/supports/{supportId}/void';
