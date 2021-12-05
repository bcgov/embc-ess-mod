/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';
import { RequestBuilder } from '../request-builder';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class ReportsService extends BaseService {
  [x: string]: any;
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation reportsGetEvacueeReport
   */
  static readonly ReportsGetEvacueeReportPath = '/api/Reports/evacuee';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `reportsGetEvacueeReport()` instead.
   *
   * This method doesn't expect any request body.
   */
  reportsGetEvacueeReport$Response(params?: {
    taskNumber?: string;
    fileId?: string;
    evacuatedFrom?: string;
    evacuatedTo?: string;
  }): Observable<StrictHttpResponse<Blob>> {

    const rb = new RequestBuilder(this.rootUrl, ReportsService.ReportsGetEvacueeReportPath, 'get');
    if (params) {
      rb.query('taskNumber', params.taskNumber, {});
      rb.query('fileId', params.fileId, {});
      rb.query('evacuatedFrom', params.evacuatedFrom, {});
      rb.query('evacuatedTo', params.evacuatedTo, {});
    }

    return this.http.request(rb.build({
      responseType: 'blob',
      accept: 'application/octet-stream'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Blob>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `reportsGetEvacueeReport$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  reportsGetEvacueeReport(params?: {
    taskNumber?: string;
    fileId?: string;
    evacuatedFrom?: string;
    evacuatedTo?: string;
  }): Observable<Blob> {

    return this.reportsGetEvacueeReport$Response(params).pipe(
      map((r: StrictHttpResponse<Blob>) => r.body as Blob)
    );
  }

  /**
   * Path part for operation reportsGetSupportReport
   */
  static readonly ReportsGetSupportReportPath = '/api/Reports/support';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `reportsGetSupportReport()` instead.
   *
   * This method doesn't expect any request body.
   */
  reportsGetSupportReport$Response(params?: {
    taskNumber?: string;
    fileId?: string;
    evacuatedFrom?: string;
    evacuatedTo?: string;
  }): Observable<StrictHttpResponse<Blob>> {

    const rb = new RequestBuilder(this.rootUrl, ReportsService.ReportsGetSupportReportPath, 'get');
    if (params) {
      rb.query('taskNumber', params.taskNumber, {});
      rb.query('fileId', params.fileId, {});
      rb.query('evacuatedFrom', params.evacuatedFrom, {});
      rb.query('evacuatedTo', params.evacuatedTo, {});
    }

    return this.http.request(rb.build({
      responseType: 'blob',
      accept: 'application/octet-stream'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Blob>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `reportsGetSupportReport$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  reportsGetSupportReport(params?: {
    taskNumber?: string;
    fileId?: string;
    evacuatedFrom?: string;
    evacuatedTo?: string;
  }): Observable<Blob> {

    return this.reportsGetSupportReport$Response(params).pipe(
      map((r: StrictHttpResponse<Blob>) => r.body as Blob)
    );
  }

}
