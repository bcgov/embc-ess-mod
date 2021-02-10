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
import { RegistrantEvacuation } from '../models/registrant-evacuation';
import { Registration } from '../models/registration';
import { RegistrationResult } from '../models/registration-result';

@Injectable({
  providedIn: 'root',
})
export class RegistrationService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation registrationCreate
   */
  static readonly RegistrationCreatePath = '/api/registration/create-registration-anonymous';

  /**
   * Anonymously Create a Registrant Profile and Evacuation File.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registrationCreate()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrationCreate$Response(params: {

    /**
     * Anonymous registration form
     */
    body: AnonymousRegistration
  }): Observable<StrictHttpResponse<RegistrationResult>> {

    const rb = new RequestBuilder(this.rootUrl, RegistrationService.RegistrationCreatePath, 'post');
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
   * To access the full response (for headers, for example), `registrationCreate$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrationCreate(params: {

    /**
     * Anonymous registration form
     */
    body: AnonymousRegistration
  }): Observable<RegistrationResult> {

    return this.registrationCreate$Response(params).pipe(
      map((r: StrictHttpResponse<RegistrationResult>) => r.body as RegistrationResult)
    );
  }

  /**
   * Path part for operation registrationCreateEvacuation
   */
  static readonly RegistrationCreateEvacuationPath = '/api/registration/evacuation';

  /**
   * Create a Registrant Evacuation.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registrationCreateEvacuation()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrationCreateEvacuation$Response(params: {

    /**
     * registrant evacuation data
     */
    body: RegistrantEvacuation
  }): Observable<StrictHttpResponse<RegistrationResult>> {

    const rb = new RequestBuilder(this.rootUrl, RegistrationService.RegistrationCreateEvacuationPath, 'post');
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
   * Create a Registrant Evacuation.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `registrationCreateEvacuation$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrationCreateEvacuation(params: {

    /**
     * registrant evacuation data
     */
    body: RegistrantEvacuation
  }): Observable<RegistrationResult> {

    return this.registrationCreateEvacuation$Response(params).pipe(
      map((r: StrictHttpResponse<RegistrationResult>) => r.body as RegistrationResult)
    );
  }

  /**
   * Path part for operation registrationCreateProfile
   */
  static readonly RegistrationCreateProfilePath = '/api/registration/create-profile';

  /**
   * Create a Registrant Profile.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registrationCreateProfile()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrationCreateProfile$Response(params: {

    /**
     * Profile Registration Form
     */
    body: Registration
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, RegistrationService.RegistrationCreateProfilePath, 'post');
    if (params) {
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
   * Create a Registrant Profile.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `registrationCreateProfile$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrationCreateProfile(params: {

    /**
     * Profile Registration Form
     */
    body: Registration
  }): Observable<void> {

    return this.registrationCreateProfile$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation registrationGetProfileById
   */
  static readonly RegistrationGetProfileByIdPath = '/api/registration/get-profile/{id}';

  /**
   * Get a Registrant Profile.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registrationGetProfileById()` instead.
   *
   * This method doesn't expect any request body.
   */
  registrationGetProfileById$Response(params: {

    /**
     * Contact Id
     */
    id: string;
  }): Observable<StrictHttpResponse<Registration>> {

    const rb = new RequestBuilder(this.rootUrl, RegistrationService.RegistrationGetProfileByIdPath, 'get');
    if (params) {
      rb.path('id', params.id, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Registration>;
      })
    );
  }

  /**
   * Get a Registrant Profile.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `registrationGetProfileById$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  registrationGetProfileById(params: {

    /**
     * Contact Id
     */
    id: string;
  }): Observable<Registration> {

    return this.registrationGetProfileById$Response(params).pipe(
      map((r: StrictHttpResponse<Registration>) => r.body as Registration)
    );
  }

  /**
   * Path part for operation registrationGetProfileByBcscId
   */
  static readonly RegistrationGetProfileByBcscIdPath = '/api/registration/get-profile-by-bcsc-id/{bcscId}';

  /**
   * Get a Registrant Profile by BCSC.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registrationGetProfileByBcscId()` instead.
   *
   * This method doesn't expect any request body.
   */
  registrationGetProfileByBcscId$Response(params: {

    /**
     * BCSC Id
     */
    bcscId: string;
  }): Observable<StrictHttpResponse<Registration>> {

    const rb = new RequestBuilder(this.rootUrl, RegistrationService.RegistrationGetProfileByBcscIdPath, 'get');
    if (params) {
      rb.path('bcscId', params.bcscId, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Registration>;
      })
    );
  }

  /**
   * Get a Registrant Profile by BCSC.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `registrationGetProfileByBcscId$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  registrationGetProfileByBcscId(params: {

    /**
     * BCSC Id
     */
    bcscId: string;
  }): Observable<Registration> {

    return this.registrationGetProfileByBcscId$Response(params).pipe(
      map((r: StrictHttpResponse<Registration>) => r.body as Registration)
    );
  }

  /**
   * Path part for operation registrationPatchProfileById
   */
  static readonly RegistrationPatchProfileByIdPath = '/api/registration/patch-profile/{id}';

  /**
   * Update a Registrant Profile.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registrationPatchProfileById()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrationPatchProfileById$Response(params: {

    /**
     * Contact Id
     */
    id: string;

    /**
     * Profile Registration Form
     */
    body: Registration
  }): Observable<StrictHttpResponse<Registration>> {

    const rb = new RequestBuilder(this.rootUrl, RegistrationService.RegistrationPatchProfileByIdPath, 'patch');
    if (params) {
      rb.path('id', params.id, {});
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Registration>;
      })
    );
  }

  /**
   * Update a Registrant Profile.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `registrationPatchProfileById$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrationPatchProfileById(params: {

    /**
     * Contact Id
     */
    id: string;

    /**
     * Profile Registration Form
     */
    body: Registration
  }): Observable<Registration> {

    return this.registrationPatchProfileById$Response(params).pipe(
      map((r: StrictHttpResponse<Registration>) => r.body as Registration)
    );
  }

}
