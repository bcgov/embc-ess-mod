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

import { SelfServeSupport } from '../models/self-serve-support';
import { SubmitSupportsRequest } from '../models/submit-supports-request';

@Injectable({
  providedIn: 'root'
})
export class SupportsService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /**
   * Path part for operation supportsGetDraftSupports
   */
  static readonly SupportsGetDraftSupportsPath = '/api/Evacuations/{fileReferenceNumber}/Supports/draft';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `supportsGetDraftSupports()` instead.
   *
   * This method doesn't expect any request body.
   */
  supportsGetDraftSupports$Response(params: {
    fileReferenceNumber: string;
  }): Observable<StrictHttpResponse<Array<SelfServeSupport>>> {
    const rb = new RequestBuilder(this.rootUrl, SupportsService.SupportsGetDraftSupportsPath, 'get');
    if (params) {
      rb.path('fileReferenceNumber', params.fileReferenceNumber, {});
    }

    return this.http
      .request(
        rb.build({
          responseType: 'json',
          accept: 'application/json'
        })
      )
      .pipe(
        filter((r: any) => r instanceof HttpResponse),
        map((r: HttpResponse<any>) => {
          return r as StrictHttpResponse<Array<SelfServeSupport>>;
        })
      );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `supportsGetDraftSupports$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  supportsGetDraftSupports(params: { fileReferenceNumber: string }): Observable<Array<SelfServeSupport>> {
    return this.supportsGetDraftSupports$Response(params).pipe(
      map((r: StrictHttpResponse<Array<SelfServeSupport>>) => r.body as Array<SelfServeSupport>)
    );
  }

  /**
   * Path part for operation supportsCalculateAmounts
   */
  static readonly SupportsCalculateAmountsPath = '/api/Evacuations/{fileReferenceNumber}/Supports/draft/totals';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `supportsCalculateAmounts()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  supportsCalculateAmounts$Response(params: {
    fileReferenceNumber: string;
    body: Array<SelfServeSupport>;
  }): Observable<StrictHttpResponse<Array<SelfServeSupport>>> {
    const rb = new RequestBuilder(this.rootUrl, SupportsService.SupportsCalculateAmountsPath, 'post');
    if (params) {
      rb.path('fileReferenceNumber', params.fileReferenceNumber, {});
      rb.body(params.body, 'application/json');
    }

    return this.http
      .request(
        rb.build({
          responseType: 'json',
          accept: 'application/json'
        })
      )
      .pipe(
        filter((r: any) => r instanceof HttpResponse),
        map((r: HttpResponse<any>) => {
          return r as StrictHttpResponse<Array<SelfServeSupport>>;
        })
      );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `supportsCalculateAmounts$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  supportsCalculateAmounts(params: {
    fileReferenceNumber: string;
    body: Array<SelfServeSupport>;
  }): Observable<Array<SelfServeSupport>> {
    return this.supportsCalculateAmounts$Response(params).pipe(
      map((r: StrictHttpResponse<Array<SelfServeSupport>>) => r.body as Array<SelfServeSupport>)
    );
  }

  /**
   * Path part for operation supportsOptOut
   */
  static readonly SupportsOptOutPath = '/api/Evacuations/{fileReferenceNumber}/Supports/optout';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `supportsOptOut()` instead.
   *
   * This method doesn't expect any request body.
   */
  supportsOptOut$Response(params: { fileReferenceNumber: string }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, SupportsService.SupportsOptOutPath, 'post');
    if (params) {
      rb.path('fileReferenceNumber', params.fileReferenceNumber, {});
    }

    return this.http
      .request(
        rb.build({
          responseType: 'text',
          accept: '*/*'
        })
      )
      .pipe(
        filter((r: any) => r instanceof HttpResponse),
        map((r: HttpResponse<any>) => {
          return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
        })
      );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `supportsOptOut$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  supportsOptOut(params: { fileReferenceNumber: string }): Observable<void> {
    return this.supportsOptOut$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation supportsSubmitSupports
   */
  static readonly SupportsSubmitSupportsPath = '/api/Evacuations/{fileReferenceNumber}/Supports';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `supportsSubmitSupports()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  supportsSubmitSupports$Response(params: {
    fileReferenceNumber: string;
    body: SubmitSupportsRequest;
  }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, SupportsService.SupportsSubmitSupportsPath, 'post');
    if (params) {
      rb.path('fileReferenceNumber', params.fileReferenceNumber, {});
      rb.body(params.body, 'application/json');
    }

    return this.http
      .request(
        rb.build({
          responseType: 'text',
          accept: '*/*'
        })
      )
      .pipe(
        filter((r: any) => r instanceof HttpResponse),
        map((r: HttpResponse<any>) => {
          return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
        })
      );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `supportsSubmitSupports$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  supportsSubmitSupports(params: { fileReferenceNumber: string; body: SubmitSupportsRequest }): Observable<void> {
    return this.supportsSubmitSupports$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }
}
