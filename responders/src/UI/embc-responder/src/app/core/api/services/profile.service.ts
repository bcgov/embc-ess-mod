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

import { UpdateUserProfileRequest } from '../models/update-user-profile-request';
import { UserProfile } from '../models/user-profile';

@Injectable({
  providedIn: 'root',
})
export class ProfileService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation profileGetCurrentUserProfile
   */
  static readonly ProfileGetCurrentUserProfilePath = '/api/Profile/current';

  /**
   * Get the current logged in user profile.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `profileGetCurrentUserProfile()` instead.
   *
   * This method doesn't expect any request body.
   */
  profileGetCurrentUserProfile$Response(params?: {
  }): Observable<StrictHttpResponse<UserProfile>> {

    const rb = new RequestBuilder(this.rootUrl, ProfileService.ProfileGetCurrentUserProfilePath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<UserProfile>;
      })
    );
  }

  /**
   * Get the current logged in user profile.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `profileGetCurrentUserProfile$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  profileGetCurrentUserProfile(params?: {
  }): Observable<UserProfile> {

    return this.profileGetCurrentUserProfile$Response(params).pipe(
      map((r: StrictHttpResponse<UserProfile>) => r.body as UserProfile)
    );
  }

  /**
   * Path part for operation profileUpdate
   */
  static readonly ProfileUpdatePath = '/api/Profile/current';

  /**
   * Update the current user's profile.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `profileUpdate()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  profileUpdate$Response(params: {

    /**
     * The profile information
     */
    body: UpdateUserProfileRequest
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ProfileService.ProfileUpdatePath, 'post');
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
   * Update the current user's profile.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `profileUpdate$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  profileUpdate(params: {

    /**
     * The profile information
     */
    body: UpdateUserProfileRequest
  }): Observable<void> {

    return this.profileUpdate$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation profileSignAgreement
   */
  static readonly ProfileSignAgreementPath = '/api/Profile/agreement';

  /**
   * Current user read and signed the electronic agreement.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `profileSignAgreement()` instead.
   *
   * This method doesn't expect any request body.
   */
  profileSignAgreement$Response(params?: {
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ProfileService.ProfileSignAgreementPath, 'post');
    if (params) {
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
   * Current user read and signed the electronic agreement.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `profileSignAgreement$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  profileSignAgreement(params?: {
  }): Observable<void> {

    return this.profileSignAgreement$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

}
