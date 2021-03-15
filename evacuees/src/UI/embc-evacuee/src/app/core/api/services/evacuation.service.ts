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

import { NeedsAssessment } from '../models/needs-assessment';

@Injectable({
  providedIn: 'root',
})
export class EvacuationService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation evacuationGetCurrentEvacuations
   */
  static readonly EvacuationGetCurrentEvacuationsPath = '/api/evacuations/current';

  /**
   * Get the currently logged in user's current list of evacuations.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `evacuationGetCurrentEvacuations()` instead.
   *
   * This method doesn't expect any request body.
   */
  evacuationGetCurrentEvacuations$Response(params?: {
  }): Observable<StrictHttpResponse<Array<NeedsAssessment>>> {

    const rb = new RequestBuilder(this.rootUrl, EvacuationService.EvacuationGetCurrentEvacuationsPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<NeedsAssessment>>;
      })
    );
  }

  /**
   * Get the currently logged in user's current list of evacuations.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `evacuationGetCurrentEvacuations$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  evacuationGetCurrentEvacuations(params?: {
  }): Observable<Array<NeedsAssessment>> {

    return this.evacuationGetCurrentEvacuations$Response(params).pipe(
      map((r: StrictHttpResponse<Array<NeedsAssessment>>) => r.body as Array<NeedsAssessment>)
    );
  }

  /**
   * Path part for operation evacuationGetPastEvacuations
   */
  static readonly EvacuationGetPastEvacuationsPath = '/api/evacuations/past';

  /**
   * Get the currently logged in user's past list of evacuations.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `evacuationGetPastEvacuations()` instead.
   *
   * This method doesn't expect any request body.
   */
  evacuationGetPastEvacuations$Response(params?: {
  }): Observable<StrictHttpResponse<Array<NeedsAssessment>>> {

    const rb = new RequestBuilder(this.rootUrl, EvacuationService.EvacuationGetPastEvacuationsPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<NeedsAssessment>>;
      })
    );
  }

  /**
   * Get the currently logged in user's past list of evacuations.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `evacuationGetPastEvacuations$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  evacuationGetPastEvacuations(params?: {
  }): Observable<Array<NeedsAssessment>> {

    return this.evacuationGetPastEvacuations$Response(params).pipe(
      map((r: StrictHttpResponse<Array<NeedsAssessment>>) => r.body as Array<NeedsAssessment>)
    );
  }

  /**
   * Path part for operation evacuationCreateEvacuation
   */
  static readonly EvacuationCreateEvacuationPath = '/api/evacuations';

  /**
   * Create a verified Evacuation.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `evacuationCreateEvacuation()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  evacuationCreateEvacuation$Response(params: {

    /**
     * Evacuation data
     */
    body: NeedsAssessment
  }): Observable<StrictHttpResponse<string>> {

    const rb = new RequestBuilder(this.rootUrl, EvacuationService.EvacuationCreateEvacuationPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
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
   * Create a verified Evacuation.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `evacuationCreateEvacuation$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  evacuationCreateEvacuation(params: {

    /**
     * Evacuation data
     */
    body: NeedsAssessment
  }): Observable<string> {

    return this.evacuationCreateEvacuation$Response(params).pipe(
      map((r: StrictHttpResponse<string>) => r.body as string)
    );
  }

  /**
   * Path part for operation evacuationUpdateEvacuation
   */
  static readonly EvacuationUpdateEvacuationPath = '/api/evacuations/{essFileNumber}';

  /**
   * Update a verified Evacuation.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `evacuationUpdateEvacuation()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  evacuationUpdateEvacuation$Response(params: {

    /**
     * ESS File Number
     */
    essFileNumber: string;

    /**
     * Evacuation data
     */
    body: NeedsAssessment
  }): Observable<StrictHttpResponse<string>> {

    const rb = new RequestBuilder(this.rootUrl, EvacuationService.EvacuationUpdateEvacuationPath, 'post');
    if (params) {
      rb.path('essFileNumber', params.essFileNumber, {});
      rb.body(params.body, 'application/json');
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
   * Update a verified Evacuation.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `evacuationUpdateEvacuation$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  evacuationUpdateEvacuation(params: {

    /**
     * ESS File Number
     */
    essFileNumber: string;

    /**
     * Evacuation data
     */
    body: NeedsAssessment
  }): Observable<string> {

    return this.evacuationUpdateEvacuation$Response(params).pipe(
      map((r: StrictHttpResponse<string>) => r.body as string)
    );
  }

}
