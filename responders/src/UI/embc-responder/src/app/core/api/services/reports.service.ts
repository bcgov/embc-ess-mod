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
    reportRequestId?: string;
  }): Observable<StrictHttpResponse<Blob>> {

    const rb = new RequestBuilder(this.rootUrl, ReportsService.ReportsGetEvacueeReportPath, 'get');
    if (params) {
      rb.query('reportRequestId', params.reportRequestId, {});
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
    reportRequestId?: string;
  }): Observable<Blob> {

    return this.reportsGetEvacueeReport$Response(params).pipe(
      map((r: StrictHttpResponse<Blob>) => r.body as Blob)
    );
  }

  /**
   * Path part for operation reportsCreateEvacueeReport
   */
  static readonly ReportsCreateEvacueeReportPath = '/api/Reports/evacuee';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `reportsCreateEvacueeReport()` instead.
   *
   * This method doesn't expect any request body.
   */
  reportsCreateEvacueeReport$Response(params?: {
    taskNumber?: string;
    fileId?: string;
    evacuatedFrom?: string;
    evacuatedTo?: string;
    from?: string;
    to?: string;
  }): Observable<StrictHttpResponse<string>> {

    const rb = new RequestBuilder(this.rootUrl, ReportsService.ReportsCreateEvacueeReportPath, 'post');
    if (params) {
      rb.query('taskNumber', params.taskNumber, {});
      rb.query('fileId', params.fileId, {});
      rb.query('evacuatedFrom', params.evacuatedFrom, {});
      rb.query('evacuatedTo', params.evacuatedTo, {});
      rb.query('from', params.from, {});
      rb.query('to', params.to, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<string>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `reportsCreateEvacueeReport$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  reportsCreateEvacueeReport(params?: {
    taskNumber?: string;
    fileId?: string;
    evacuatedFrom?: string;
    evacuatedTo?: string;
    from?: string;
    to?: string;
  }): Observable<string> {

    return this.reportsCreateEvacueeReport$Response(params).pipe(
      map((r: StrictHttpResponse<string>) => r.body as string)
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
    reportRequestId?: string;
  }): Observable<StrictHttpResponse<Blob>> {

    const rb = new RequestBuilder(this.rootUrl, ReportsService.ReportsGetSupportReportPath, 'get');
    if (params) {
      rb.query('reportRequestId', params.reportRequestId, {});
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
    reportRequestId?: string;
  }): Observable<Blob> {

    return this.reportsGetSupportReport$Response(params).pipe(
      map((r: StrictHttpResponse<Blob>) => r.body as Blob)
    );
  }

  /**
   * Path part for operation reportsCreateSupportReport
   */
  static readonly ReportsCreateSupportReportPath = '/api/Reports/support';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `reportsCreateSupportReport()` instead.
   *
   * This method doesn't expect any request body.
   */
  reportsCreateSupportReport$Response(params?: {
    taskNumber?: string;
    fileId?: string;
    evacuatedFrom?: string;
    evacuatedTo?: string;
    from?: string;
    to?: string;
  }): Observable<StrictHttpResponse<string>> {

    const rb = new RequestBuilder(this.rootUrl, ReportsService.ReportsCreateSupportReportPath, 'post');
    if (params) {
      rb.query('taskNumber', params.taskNumber, {});
      rb.query('fileId', params.fileId, {});
      rb.query('evacuatedFrom', params.evacuatedFrom, {});
      rb.query('evacuatedTo', params.evacuatedTo, {});
      rb.query('from', params.from, {});
      rb.query('to', params.to, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<string>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `reportsCreateSupportReport$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  reportsCreateSupportReport(params?: {
    taskNumber?: string;
    fileId?: string;
    evacuatedFrom?: string;
    evacuatedTo?: string;
    from?: string;
    to?: string;
  }): Observable<string> {

    return this.reportsCreateSupportReport$Response(params).pipe(
      map((r: StrictHttpResponse<string>) => r.body as string)
    );
  }

}
