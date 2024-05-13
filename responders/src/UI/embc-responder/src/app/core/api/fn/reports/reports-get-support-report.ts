/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

export interface ReportsGetSupportReport$Params {
  reportRequestId?: string;
}

export function reportsGetSupportReport(
  http: HttpClient,
  rootUrl: string,
  params?: ReportsGetSupportReport$Params,
  context?: HttpContext
): Observable<StrictHttpResponse<Blob>> {
  const rb = new RequestBuilder(rootUrl, reportsGetSupportReport.PATH, 'get');
  if (params) {
    rb.query('reportRequestId', params.reportRequestId, {});
  }

  return http.request(rb.build({ responseType: 'blob', accept: 'application/octet-stream', context })).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Blob>;
    })
  );
}

reportsGetSupportReport.PATH = '/api/Reports/support';
