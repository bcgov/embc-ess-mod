/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { profileGetCurrentUserProfile } from '../fn/profile/profile-get-current-user-profile';
import { ProfileGetCurrentUserProfile$Params } from '../fn/profile/profile-get-current-user-profile';
import { profileSignAgreement } from '../fn/profile/profile-sign-agreement';
import { ProfileSignAgreement$Params } from '../fn/profile/profile-sign-agreement';
import { profileUpdate } from '../fn/profile/profile-update';
import { ProfileUpdate$Params } from '../fn/profile/profile-update';
import { UserProfile } from '../models/user-profile';

@Injectable({ providedIn: 'root' })
export class ProfileService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `profileGetCurrentUserProfile()` */
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
  profileGetCurrentUserProfile$Response(
    params?: ProfileGetCurrentUserProfile$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<UserProfile>> {
    return profileGetCurrentUserProfile(this.http, this.rootUrl, params, context);
  }

  /**
   * Get the current logged in user profile.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `profileGetCurrentUserProfile$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  profileGetCurrentUserProfile(
    params?: ProfileGetCurrentUserProfile$Params,
    context?: HttpContext
  ): Observable<UserProfile> {
    return this.profileGetCurrentUserProfile$Response(params, context).pipe(
      map((r: StrictHttpResponse<UserProfile>): UserProfile => r.body)
    );
  }

  /** Path part for operation `profileUpdate()` */
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
  profileUpdate$Response(params: ProfileUpdate$Params, context?: HttpContext): Observable<StrictHttpResponse<void>> {
    return profileUpdate(this.http, this.rootUrl, params, context);
  }

  /**
   * Update the current user's profile.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `profileUpdate$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  profileUpdate(params: ProfileUpdate$Params, context?: HttpContext): Observable<void> {
    return this.profileUpdate$Response(params, context).pipe(map((r: StrictHttpResponse<void>): void => r.body));
  }

  /** Path part for operation `profileSignAgreement()` */
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
  profileSignAgreement$Response(
    params?: ProfileSignAgreement$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<void>> {
    return profileSignAgreement(this.http, this.rootUrl, params, context);
  }

  /**
   * Current user read and signed the electronic agreement.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `profileSignAgreement$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  profileSignAgreement(params?: ProfileSignAgreement$Params, context?: HttpContext): Observable<void> {
    return this.profileSignAgreement$Response(params, context).pipe(map((r: StrictHttpResponse<void>): void => r.body));
  }
}
