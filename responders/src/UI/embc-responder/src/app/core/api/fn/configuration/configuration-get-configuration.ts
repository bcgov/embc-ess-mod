/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { Configuration } from '../../models/configuration';

export interface ConfigurationGetConfiguration$Params {}

export function configurationGetConfiguration(
  http: HttpClient,
  rootUrl: string,
  params?: ConfigurationGetConfiguration$Params,
  context?: HttpContext
): Observable<StrictHttpResponse<Configuration>> {
  const rb = new RequestBuilder(rootUrl, configurationGetConfiguration.PATH, 'get');
  if (params) {
  }

  return http.request(rb.build({ responseType: 'json', accept: 'application/json', context })).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Configuration>;
    })
  );
}

configurationGetConfiguration.PATH = '/api/Configuration';
