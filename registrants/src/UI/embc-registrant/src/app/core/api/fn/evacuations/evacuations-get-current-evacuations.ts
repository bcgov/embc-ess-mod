/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { EvacuationFile } from '../../models/evacuation-file';

export interface EvacuationsGetCurrentEvacuations$Params {}

export function evacuationsGetCurrentEvacuations(
  http: HttpClient,
  rootUrl: string,
  params?: EvacuationsGetCurrentEvacuations$Params,
  context?: HttpContext
): Observable<StrictHttpResponse<Array<EvacuationFile>>> {
  const rb = new RequestBuilder(rootUrl, evacuationsGetCurrentEvacuations.PATH, 'get');
  if (params) {
  }

  return http.request(rb.build({ responseType: 'json', accept: 'application/json', context })).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Array<EvacuationFile>>;
    })
  );
}

evacuationsGetCurrentEvacuations.PATH = '/api/Evacuations/current';
