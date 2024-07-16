/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

export interface ReportsCreateEvacueeReport$Params {
  taskNumber?: string;
  fileId?: string;
  evacuatedFrom?: string;
  evacuatedTo?: string;
  from?: string;
  to?: string;
}

export function reportsCreateEvacueeReport(
  http: HttpClient,
  rootUrl: string,
  params?: ReportsCreateEvacueeReport$Params,
  context?: HttpContext
): Observable<StrictHttpResponse<string>> {
  const rb = new RequestBuilder(rootUrl, reportsCreateEvacueeReport.PATH, 'post');
  if (params) {
    rb.query('taskNumber', params.taskNumber, {});
    rb.query('fileId', params.fileId, {});
    rb.query('evacuatedFrom', params.evacuatedFrom, {});
    rb.query('evacuatedTo', params.evacuatedTo, {});
    rb.query('from', params.from, {});
    rb.query('to', params.to, {});
  }

  return http.request(rb.build({ responseType: 'json', accept: 'application/json', context })).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<string>;
    })
  );
}

reportsCreateEvacueeReport.PATH = '/api/Reports/evacuee';
