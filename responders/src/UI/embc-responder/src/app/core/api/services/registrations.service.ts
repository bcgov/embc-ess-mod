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

import { EvacueeProfile } from '../models/evacuee-profile';
import { GetSecurityPhraseResponse } from '../models/get-security-phrase-response';
import { GetSecurityQuestionsResponse } from '../models/get-security-questions-response';
import { SearchResults } from '../models/search-results';
import { VerifySecurityPhraseRequest } from '../models/verify-security-phrase-request';
import { VerifySecurityPhraseResponse } from '../models/verify-security-phrase-response';
import { VerifySecurityQuestionsRequest } from '../models/verify-security-questions-request';
import { VerifySecurityQuestionsResponse } from '../models/verify-security-questions-response';

@Injectable({
  providedIn: 'root',
})
export class RegistrationsService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation registrationsSearch
   */
  static readonly RegistrationsSearchPath = '/api/Registrations';

  /**
   * Search evacuation files and profiles matching the search parameters.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registrationsSearch()` instead.
   *
   * This method doesn't expect any request body.
   */
  registrationsSearch$Response(params?: {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
  }): Observable<StrictHttpResponse<SearchResults>> {

    const rb = new RequestBuilder(this.rootUrl, RegistrationsService.RegistrationsSearchPath, 'get');
    if (params) {
      rb.query('firstName', params.firstName, {});
      rb.query('lastName', params.lastName, {});
      rb.query('dateOfBirth', params.dateOfBirth, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<SearchResults>;
      })
    );
  }

  /**
   * Search evacuation files and profiles matching the search parameters.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `registrationsSearch$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  registrationsSearch(params?: {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
  }): Observable<SearchResults> {

    return this.registrationsSearch$Response(params).pipe(
      map((r: StrictHttpResponse<SearchResults>) => r.body as SearchResults)
    );
  }

  /**
   * Path part for operation registrationsGetSecurityQuestions
   */
  static readonly RegistrationsGetSecurityQuestionsPath = '/api/Registrations/registrants/{registrantId}/security';

  /**
   * Get security questions for a registrant.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registrationsGetSecurityQuestions()` instead.
   *
   * This method doesn't expect any request body.
   */
  registrationsGetSecurityQuestions$Response(params: {

    /**
     * registrant id
     */
    registrantId: string;
  }): Observable<StrictHttpResponse<GetSecurityQuestionsResponse>> {

    const rb = new RequestBuilder(this.rootUrl, RegistrationsService.RegistrationsGetSecurityQuestionsPath, 'get');
    if (params) {
      rb.path('registrantId', params.registrantId, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<GetSecurityQuestionsResponse>;
      })
    );
  }

  /**
   * Get security questions for a registrant.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `registrationsGetSecurityQuestions$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  registrationsGetSecurityQuestions(params: {

    /**
     * registrant id
     */
    registrantId: string;
  }): Observable<GetSecurityQuestionsResponse> {

    return this.registrationsGetSecurityQuestions$Response(params).pipe(
      map((r: StrictHttpResponse<GetSecurityQuestionsResponse>) => r.body as GetSecurityQuestionsResponse)
    );
  }

  /**
   * Path part for operation registrationsVerifySecurityQuestions
   */
  static readonly RegistrationsVerifySecurityQuestionsPath = '/api/Registrations/registrants/{registrantId}/security';

  /**
   * verify answers for security questions.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registrationsVerifySecurityQuestions()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrationsVerifySecurityQuestions$Response(params: {

    /**
     * registrant id
     */
    registrantId: string;

    /**
     * array of questions and their answers
     */
    body: VerifySecurityQuestionsRequest
  }): Observable<StrictHttpResponse<VerifySecurityQuestionsResponse>> {

    const rb = new RequestBuilder(this.rootUrl, RegistrationsService.RegistrationsVerifySecurityQuestionsPath, 'post');
    if (params) {
      rb.path('registrantId', params.registrantId, {});
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<VerifySecurityQuestionsResponse>;
      })
    );
  }

  /**
   * verify answers for security questions.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `registrationsVerifySecurityQuestions$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrationsVerifySecurityQuestions(params: {

    /**
     * registrant id
     */
    registrantId: string;

    /**
     * array of questions and their answers
     */
    body: VerifySecurityQuestionsRequest
  }): Observable<VerifySecurityQuestionsResponse> {

    return this.registrationsVerifySecurityQuestions$Response(params).pipe(
      map((r: StrictHttpResponse<VerifySecurityQuestionsResponse>) => r.body as VerifySecurityQuestionsResponse)
    );
  }

  /**
   * Path part for operation registrationsGetSecurityPhrase
   */
  static readonly RegistrationsGetSecurityPhrasePath = '/api/Registrations/files/{fileId}/security';

  /**
   * get the security phrase of an evacuation file.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registrationsGetSecurityPhrase()` instead.
   *
   * This method doesn't expect any request body.
   */
  registrationsGetSecurityPhrase$Response(params: {

    /**
     * file id
     */
    fileId: string;
  }): Observable<StrictHttpResponse<GetSecurityPhraseResponse>> {

    const rb = new RequestBuilder(this.rootUrl, RegistrationsService.RegistrationsGetSecurityPhrasePath, 'get');
    if (params) {
      rb.path('fileId', params.fileId, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<GetSecurityPhraseResponse>;
      })
    );
  }

  /**
   * get the security phrase of an evacuation file.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `registrationsGetSecurityPhrase$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  registrationsGetSecurityPhrase(params: {

    /**
     * file id
     */
    fileId: string;
  }): Observable<GetSecurityPhraseResponse> {

    return this.registrationsGetSecurityPhrase$Response(params).pipe(
      map((r: StrictHttpResponse<GetSecurityPhraseResponse>) => r.body as GetSecurityPhraseResponse)
    );
  }

  /**
   * Path part for operation registrationsVerifySecurityPhrase
   */
  static readonly RegistrationsVerifySecurityPhrasePath = '/api/Registrations/files/{fileId}/security';

  /**
   * verify an evacuation file's security phrase.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registrationsVerifySecurityPhrase()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrationsVerifySecurityPhrase$Response(params: {

    /**
     * file id
     */
    fileId: string;

    /**
     * security phrase to verify
     */
    body: VerifySecurityPhraseRequest
  }): Observable<StrictHttpResponse<VerifySecurityPhraseResponse>> {

    const rb = new RequestBuilder(this.rootUrl, RegistrationsService.RegistrationsVerifySecurityPhrasePath, 'post');
    if (params) {
      rb.path('fileId', params.fileId, {});
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<VerifySecurityPhraseResponse>;
      })
    );
  }

  /**
   * verify an evacuation file's security phrase.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `registrationsVerifySecurityPhrase$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrationsVerifySecurityPhrase(params: {

    /**
     * file id
     */
    fileId: string;

    /**
     * security phrase to verify
     */
    body: VerifySecurityPhraseRequest
  }): Observable<VerifySecurityPhraseResponse> {

    return this.registrationsVerifySecurityPhrase$Response(params).pipe(
      map((r: StrictHttpResponse<VerifySecurityPhraseResponse>) => r.body as VerifySecurityPhraseResponse)
    );
  }

  /**
   * Path part for operation registrationsUpsertRegistrantProfile
   */
  static readonly RegistrationsUpsertRegistrantProfilePath = '/api/Registrations/profile';

  /**
   * Creates or updates a Registrant Profile.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registrationsUpsertRegistrantProfile()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrationsUpsertRegistrantProfile$Response(params: {

    /**
     * Evacuee
     */
    body: EvacueeProfile
  }): Observable<StrictHttpResponse<string>> {

    const rb = new RequestBuilder(this.rootUrl, RegistrationsService.RegistrationsUpsertRegistrantProfilePath, 'post');
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
   * Creates or updates a Registrant Profile.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `registrationsUpsertRegistrantProfile$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrationsUpsertRegistrantProfile(params: {

    /**
     * Evacuee
     */
    body: EvacueeProfile
  }): Observable<string> {

    return this.registrationsUpsertRegistrantProfile$Response(params).pipe(
      map((r: StrictHttpResponse<string>) => r.body as string)
    );
  }

}
