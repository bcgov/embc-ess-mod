/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

export interface RegistrationsCancelSupport$Params {
  fileId: string;
  supportId: string;
}

export function registrationsCancelSupport(
  http: HttpClient,
  rootUrl: string,
  params: RegistrationsCancelSupport$Params,
  context?: HttpContext
): Observable<StrictHttpResponse<void>> {
  const rb = new RequestBuilder(rootUrl, registrationsCancelSupport.PATH, 'post');
  if (params) {
    rb.path('fileId', params.fileId, {});
    rb.path('supportId', params.supportId, {});
  }

  return http.request(rb.build({ responseType: 'text', accept: '*/*', context })).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
    })
  );
}

registrationsCancelSupport.PATH = '/api/Registrations/files/{fileId}/supports/{supportId}/cancel';
