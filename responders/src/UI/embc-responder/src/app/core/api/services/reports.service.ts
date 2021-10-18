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
   * Path part for operation reportsGetPrint
   */
  static readonly ReportsGetPrintPath = '/api/Reports/evacuee';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `reportsGetPrint()` instead.
   *
   * This method doesn't expect any request body.
   */
  reportsGetPrint$Response(params?: {
    taskNumber?: string;
    fileId?: string;
    evacuatedFrom?: string;
    evacuatedTo?: string;
  }): Observable<StrictHttpResponse<Blob>> {

    const rb = new RequestBuilder(this.rootUrl, ReportsService.ReportsGetPrintPath, 'get');
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
   * To access the full response (for headers, for example), `reportsGetPrint$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  reportsGetPrint(params?: {
    taskNumber?: string;
    fileId?: string;
    evacuatedFrom?: string;
    evacuatedTo?: string;
  }): Observable<Blob> {

    return this.reportsGetPrint$Response(params).pipe(
      map((r: StrictHttpResponse<Blob>) => r.body as Blob)
    );
  }

}
