/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

export interface ConfigurationGetAuditOptions$Params {}

export function configurationGetAuditOptions(
  http: HttpClient,
  rootUrl: string,
  params?: ConfigurationGetAuditOptions$Params,
  context?: HttpContext
): Observable<
  StrictHttpResponse<{
    [key: string]: string;
  }>
> {
  const rb = new RequestBuilder(rootUrl, configurationGetAuditOptions.PATH, 'get');
  if (params) {
  }

  return http.request(rb.build({ responseType: 'json', accept: 'application/json', context })).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<{
        [key: string]: string;
      }>;
    })
  );
}

configurationGetAuditOptions.PATH = '/api/Configuration/access-reasons';
