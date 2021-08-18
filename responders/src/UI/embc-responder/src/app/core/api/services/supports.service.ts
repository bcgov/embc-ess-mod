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

import { Support } from '../models/support';

@Injectable({
  providedIn: 'root',
})
export class SupportsService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation supportsGet
   */
  static readonly SupportsGetPath = '/api/registrations/{fileId}/Supports';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `supportsGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  supportsGet$Response(params: {
    fileId: string;
  }): Observable<StrictHttpResponse<Array<Support>>> {

    const rb = new RequestBuilder(this.rootUrl, SupportsService.SupportsGetPath, 'get');
    if (params) {
      rb.path('fileId', params.fileId, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<Support>>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `supportsGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  supportsGet(params: {
    fileId: string;
  }): Observable<Array<Support>> {

    return this.supportsGet$Response(params).pipe(
      map((r: StrictHttpResponse<Array<Support>>) => r.body as Array<Support>)
    );
  }

  /**
   * Path part for operation supportsPost
   */
  static readonly SupportsPostPath = '/api/registrations/{fileId}/Supports';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `supportsPost()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  supportsPost$Response(params: {
    fileId: string;
    body: Array<Support>
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, SupportsService.SupportsPostPath, 'post');
    if (params) {
      rb.path('fileId', params.fileId, {});
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `supportsPost$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  supportsPost(params: {
    fileId: string;
    body: Array<Support>
  }): Observable<void> {

    return this.supportsPost$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation supportsGetOne
   */
  static readonly SupportsGetOnePath = '/api/registrations/{fileId}/Supports/{supportId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `supportsGetOne()` instead.
   *
   * This method doesn't expect any request body.
   */
  supportsGetOne$Response(params: {
    fileId: string;
    supportId: string;
  }): Observable<StrictHttpResponse<Support>> {

    const rb = new RequestBuilder(this.rootUrl, SupportsService.SupportsGetOnePath, 'get');
    if (params) {
      rb.path('fileId', params.fileId, {});
      rb.path('supportId', params.supportId, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Support>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `supportsGetOne$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  supportsGetOne(params: {
    fileId: string;
    supportId: string;
  }): Observable<Support> {

    return this.supportsGetOne$Response(params).pipe(
      map((r: StrictHttpResponse<Support>) => r.body as Support)
    );
  }

}
