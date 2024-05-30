/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { Code } from '../../models/code';

export interface ConfigurationGetCodes$Params {
  forEnumType?: string;
}

export function configurationGetCodes(
  http: HttpClient,
  rootUrl: string,
  params?: ConfigurationGetCodes$Params,
  context?: HttpContext
): Observable<StrictHttpResponse<Array<Code>>> {
  const rb = new RequestBuilder(rootUrl, configurationGetCodes.PATH, 'get');
  if (params) {
    rb.query('forEnumType', params.forEnumType, {});
  }

  return http.request(rb.build({ responseType: 'json', accept: 'application/json', context })).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Array<Code>>;
    })
  );
}

configurationGetCodes.PATH = '/api/Configuration/codes';
