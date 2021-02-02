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


@Injectable({
  providedIn: 'root',
})
export class LoginService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation loginLogin
   */
  static readonly LoginLoginPath = '/login';

  /**
   * Initiate the BCSC OIDC login challenge.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `loginLogin()` instead.
   *
   * This method doesn't expect any request body.
   */
  loginLogin$Response(params?: {

    /**
     * The url to redirect the user after successful login, must be a local path and not a full url
     */
    returnUrl?: string;

    /**
     * Optional user id to impersonate as (to support automated tests and ease of development in non prod environments only)
     */
    loginAs?: string;
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, LoginService.LoginLoginPath, 'get');
    if (params) {
      rb.query('returnUrl', params.returnUrl, {});
      rb.query('loginAs', params.loginAs, {});
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
   * Initiate the BCSC OIDC login challenge.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `loginLogin$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  loginLogin(params?: {

    /**
     * The url to redirect the user after successful login, must be a local path and not a full url
     */
    returnUrl?: string;

    /**
     * Optional user id to impersonate as (to support automated tests and ease of development in non prod environments only)
     */
    loginAs?: string;
  }): Observable<void> {

    return this.loginLogin$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation loginToken
   */
  static readonly LoginTokenPath = '/token';

  /**
   * Issue a new token based on asp.net authentication cookie.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `loginToken()` instead.
   *
   * This method doesn't expect any request body.
   */
  loginToken$Response(params?: {
  }): Observable<StrictHttpResponse<string>> {

    const rb = new RequestBuilder(this.rootUrl, LoginService.LoginTokenPath, 'get');
    if (params) {
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
   * Issue a new token based on asp.net authentication cookie.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `loginToken$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  loginToken(params?: {
  }): Observable<string> {

    return this.loginToken$Response(params).pipe(
      map((r: StrictHttpResponse<string>) => r.body as string)
    );
  }

  /**
   * Path part for operation loginRefreshToken
   */
  static readonly LoginRefreshTokenPath = '/token/refresh';

  /**
   * Refresh the current user's token.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `loginRefreshToken()` instead.
   *
   * This method doesn't expect any request body.
   */
  loginRefreshToken$Response(params?: {
  }): Observable<StrictHttpResponse<string>> {

    const rb = new RequestBuilder(this.rootUrl, LoginService.LoginRefreshTokenPath, 'get');
    if (params) {
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
   * Refresh the current user's token.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `loginRefreshToken$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  loginRefreshToken(params?: {
  }): Observable<string> {

    return this.loginRefreshToken$Response(params).pipe(
      map((r: StrictHttpResponse<string>) => r.body as string)
    );
  }

}
