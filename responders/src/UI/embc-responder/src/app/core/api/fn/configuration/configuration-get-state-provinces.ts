/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { CommunityCode } from '../../models/community-code';

export interface ConfigurationGetStateProvinces$Params {
  countryId?: string | null;
}

export function configurationGetStateProvinces(
  http: HttpClient,
  rootUrl: string,
  params?: ConfigurationGetStateProvinces$Params,
  context?: HttpContext
): Observable<StrictHttpResponse<Array<CommunityCode>>> {
  const rb = new RequestBuilder(rootUrl, configurationGetStateProvinces.PATH, 'get');
  if (params) {
    rb.query('countryId', params.countryId, {});
  }

  return http.request(rb.build({ responseType: 'json', accept: 'application/json', context })).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Array<CommunityCode>>;
    })
  );
}

configurationGetStateProvinces.PATH = '/api/Configuration/codes/stateprovinces';
