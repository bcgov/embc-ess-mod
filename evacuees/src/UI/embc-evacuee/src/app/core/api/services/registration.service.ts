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

}
