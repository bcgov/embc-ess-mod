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

import { AnonymousRegistration } from '../models/anonymous-registration';
import { EvacuationFile } from '../models/evacuation-file';
import { RegistrationResult } from '../models/registration-result';

@Injectable({
  providedIn: 'root',
})
export class EvacuationsService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation evacuationsCreate
   */
  static readonly EvacuationsCreatePath = '/api/Evacuations/create-registration-anonymous';

  /**
   * Anonymously Create a Registrant Profile and Evacuation File.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `evacuationsCreate()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  evacuationsCreate$Response(params: {

    /**
     * Anonymous registration form
     */
    body: AnonymousRegistration
  }): Observable<StrictHttpResponse<RegistrationResult>> {

    const rb = new RequestBuilder(this.rootUrl, EvacuationsService.EvacuationsCreatePath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<RegistrationResult>;
      })
    );
  }

  /**
   * Anonymously Create a Registrant Profile and Evacuation File.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `evacuationsCreate$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  evacuationsCreate(params: {

    /**
     * Anonymous registration form
     */
    body: AnonymousRegistration
  }): Observable<RegistrationResult> {

    return this.evacuationsCreate$Response(params).pipe(
      map((r: StrictHttpResponse<RegistrationResult>) => r.body as RegistrationResult)
    );
  }

  /**
   * Path part for operation evacuationsGetCurrentEvacuations
   */
  static readonly EvacuationsGetCurrentEvacuationsPath = '/api/Evacuations/current';

  /**
   * Get the currently logged in user's current list of evacuations.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `evacuationsGetCurrentEvacuations()` instead.
   *
   * This method doesn't expect any request body.
   */
  evacuationsGetCurrentEvacuations$Response(params?: {
  }): Observable<StrictHttpResponse<Array<EvacuationFile>>> {

    const rb = new RequestBuilder(this.rootUrl, EvacuationsService.EvacuationsGetCurrentEvacuationsPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<EvacuationFile>>;
      })
    );
  }

  /**
   * Get the currently logged in user's current list of evacuations.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `evacuationsGetCurrentEvacuations$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  evacuationsGetCurrentEvacuations(params?: {
  }): Observable<Array<EvacuationFile>> {

    return this.evacuationsGetCurrentEvacuations$Response(params).pipe(
      map((r: StrictHttpResponse<Array<EvacuationFile>>) => r.body as Array<EvacuationFile>)
    );
  }

  /**
   * Path part for operation evacuationsGetPastEvacuations
   */
  static readonly EvacuationsGetPastEvacuationsPath = '/api/Evacuations/past';

  /**
   * Get the currently logged in user's past list of evacuations.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `evacuationsGetPastEvacuations()` instead.
   *
   * This method doesn't expect any request body.
   */
  evacuationsGetPastEvacuations$Response(params?: {
  }): Observable<StrictHttpResponse<Array<EvacuationFile>>> {

    const rb = new RequestBuilder(this.rootUrl, EvacuationsService.EvacuationsGetPastEvacuationsPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<EvacuationFile>>;
      })
    );
  }

  /**
   * Get the currently logged in user's past list of evacuations.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `evacuationsGetPastEvacuations$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  evacuationsGetPastEvacuations(params?: {
  }): Observable<Array<EvacuationFile>> {

    return this.evacuationsGetPastEvacuations$Response(params).pipe(
      map((r: StrictHttpResponse<Array<EvacuationFile>>) => r.body as Array<EvacuationFile>)
    );
  }

  /**
   * Path part for operation evacuationsUpsertEvacuationFile
   */
  static readonly EvacuationsUpsertEvacuationFilePath = '/api/Evacuations';

  /**
   * Create or update a verified Evacuation file.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `evacuationsUpsertEvacuationFile()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  evacuationsUpsertEvacuationFile$Response(params: {

    /**
     * Evacuation data
     */
    body: EvacuationFile
  }): Observable<StrictHttpResponse<RegistrationResult>> {

    const rb = new RequestBuilder(this.rootUrl, EvacuationsService.EvacuationsUpsertEvacuationFilePath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<RegistrationResult>;
      })
    );
  }

  /**
   * Create or update a verified Evacuation file.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `evacuationsUpsertEvacuationFile$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  evacuationsUpsertEvacuationFile(params: {

    /**
     * Evacuation data
     */
    body: EvacuationFile
  }): Observable<RegistrationResult> {

    return this.evacuationsUpsertEvacuationFile$Response(params).pipe(
      map((r: StrictHttpResponse<RegistrationResult>) => r.body as RegistrationResult)
    );
  }

}
