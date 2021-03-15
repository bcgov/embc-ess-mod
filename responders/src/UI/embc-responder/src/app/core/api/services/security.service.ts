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

import { UserProfile } from '../models/user-profile';

@Injectable({
  providedIn: 'root',
})
export class SecurityService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation securityGetCurrentUserProfile
   */
  static readonly SecurityGetCurrentUserProfilePath = '/api/security/profile/current';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `securityGetCurrentUserProfile()` instead.
   *
   * This method doesn't expect any request body.
   */
  securityGetCurrentUserProfile$Response(params?: {
  }): Observable<StrictHttpResponse<UserProfile>> {

    const rb = new RequestBuilder(this.rootUrl, SecurityService.SecurityGetCurrentUserProfilePath, 'get');
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
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `securityGetCurrentUserProfile$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  securityGetCurrentUserProfile(params?: {
  }): Observable<UserProfile> {

    return this.securityGetCurrentUserProfile$Response(params).pipe(
      map((r: StrictHttpResponse<UserProfile>) => r.body as UserProfile)
    );
  }

}
