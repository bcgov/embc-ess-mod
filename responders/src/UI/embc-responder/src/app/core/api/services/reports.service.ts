/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { reportsCreateEvacueeReport } from '../fn/reports/reports-create-evacuee-report';
import { ReportsCreateEvacueeReport$Params } from '../fn/reports/reports-create-evacuee-report';
import { reportsCreateSupportReport } from '../fn/reports/reports-create-support-report';
import { ReportsCreateSupportReport$Params } from '../fn/reports/reports-create-support-report';
import { reportsGetEvacueeReport } from '../fn/reports/reports-get-evacuee-report';
import { ReportsGetEvacueeReport$Params } from '../fn/reports/reports-get-evacuee-report';
import { reportsGetSupportReport } from '../fn/reports/reports-get-support-report';
import { ReportsGetSupportReport$Params } from '../fn/reports/reports-get-support-report';

@Injectable({ providedIn: 'root' })
export class ReportsService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `reportsGetEvacueeReport()` */
  static readonly ReportsGetEvacueeReportPath = '/api/Reports/evacuee';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `reportsGetEvacueeReport()` instead.
   *
   * This method doesn't expect any request body.
   */
  reportsGetEvacueeReport$Response(
    params?: ReportsGetEvacueeReport$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<void>> {
    return reportsGetEvacueeReport(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `reportsGetEvacueeReport$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  reportsGetEvacueeReport(params?: ReportsGetEvacueeReport$Params, context?: HttpContext): Observable<void> {
    return this.reportsGetEvacueeReport$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

  /** Path part for operation `reportsCreateEvacueeReport()` */
  static readonly ReportsCreateEvacueeReportPath = '/api/Reports/evacuee';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `reportsCreateEvacueeReport()` instead.
   *
   * This method doesn't expect any request body.
   */
  reportsCreateEvacueeReport$Response(
    params?: ReportsCreateEvacueeReport$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<string>> {
    return reportsCreateEvacueeReport(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `reportsCreateEvacueeReport$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  reportsCreateEvacueeReport(params?: ReportsCreateEvacueeReport$Params, context?: HttpContext): Observable<string> {
    return this.reportsCreateEvacueeReport$Response(params, context).pipe(
      map((r: StrictHttpResponse<string>): string => r.body)
    );
  }

  /** Path part for operation `reportsGetSupportReport()` */
  static readonly ReportsGetSupportReportPath = '/api/Reports/support';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `reportsGetSupportReport()` instead.
   *
   * This method doesn't expect any request body.
   */
  reportsGetSupportReport$Response(
    params?: ReportsGetSupportReport$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<void>> {
    return reportsGetSupportReport(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `reportsGetSupportReport$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  reportsGetSupportReport(params?: ReportsGetSupportReport$Params, context?: HttpContext): Observable<void> {
    return this.reportsGetSupportReport$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

  /** Path part for operation `reportsCreateSupportReport()` */
  static readonly ReportsCreateSupportReportPath = '/api/Reports/support';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `reportsCreateSupportReport()` instead.
   *
   * This method doesn't expect any request body.
   */
  reportsCreateSupportReport$Response(
    params?: ReportsCreateSupportReport$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<string>> {
    return reportsCreateSupportReport(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `reportsCreateSupportReport$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  reportsCreateSupportReport(params?: ReportsCreateSupportReport$Params, context?: HttpContext): Observable<string> {
    return this.reportsCreateSupportReport$Response(params, context).pipe(
      map((r: StrictHttpResponse<string>): string => r.body)
    );
  }
}
