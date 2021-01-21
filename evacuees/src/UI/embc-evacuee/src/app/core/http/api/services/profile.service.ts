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

import { Profile } from '../models/profile';

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
   * Path part for operation profileGetProfile
   */
  static readonly ProfileGetProfilePath = '/api/profile';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `profileGetProfile()` instead.
   *
   * This method doesn't expect any request body.
   */
  profileGetProfile$Response(params?: {
  }): Observable<StrictHttpResponse<Profile>> {

    const rb = new RequestBuilder(this.rootUrl, ProfileService.ProfileGetProfilePath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Profile>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `profileGetProfile$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  profileGetProfile(params?: {
  }): Observable<Profile> {

    return this.profileGetProfile$Response(params).pipe(
      map((r: StrictHttpResponse<Profile>) => r.body as Profile)
    );
  }

}
