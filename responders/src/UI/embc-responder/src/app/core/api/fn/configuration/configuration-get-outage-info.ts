/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { OutageInformation } from '../../models/outage-information';

export interface ConfigurationGetOutageInfo$Params {}

export function configurationGetOutageInfo(
  http: HttpClient,
  rootUrl: string,
  params?: ConfigurationGetOutageInfo$Params,
  context?: HttpContext
): Observable<StrictHttpResponse<OutageInformation>> {
  const rb = new RequestBuilder(rootUrl, configurationGetOutageInfo.PATH, 'get');
  if (params) {
  }

  return http.request(rb.build({ responseType: 'json', accept: 'application/json', context })).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<OutageInformation>;
    })
  );
}

configurationGetOutageInfo.PATH = '/api/Configuration/outage-info';
