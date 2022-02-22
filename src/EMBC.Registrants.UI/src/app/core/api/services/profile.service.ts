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

import { InviteRequest } from '../models/invite-request';
import { InviteToken } from '../models/invite-token';
import { Profile } from '../models/profile';
import { ProfileDataConflict } from '../models/profile-data-conflict';

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
  static readonly ProfileGetProfilePath = '/api/profiles/current';

  /**
   * Get the current logged in user's profile.
   *
   *
   *
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
   * Get the current logged in user's profile.
   *
   *
   *
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

  /**
   * Path part for operation profileUpsert
   */
  static readonly ProfileUpsertPath = '/api/profiles/current';

  /**
   * Create or update the current user's profile.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `profileUpsert()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  profileUpsert$Response(params: {

    /**
     * The profile information
     */
    body: Profile
  }): Observable<StrictHttpResponse<string>> {

    const rb = new RequestBuilder(this.rootUrl, ProfileService.ProfileUpsertPath, 'post');
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
   * Create or update the current user's profile.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `profileUpsert$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  profileUpsert(params: {

    /**
     * The profile information
     */
    body: Profile
  }): Observable<string> {

    return this.profileUpsert$Response(params).pipe(
      map((r: StrictHttpResponse<string>) => r.body as string)
    );
  }

  /**
   * Path part for operation profileGetDoesUserExists
   */
  static readonly ProfileGetDoesUserExistsPath = '/api/profiles/current/exists';

  /**
   * check if user exists or not.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `profileGetDoesUserExists()` instead.
   *
   * This method doesn't expect any request body.
   */
  profileGetDoesUserExists$Response(params?: {
  }): Observable<StrictHttpResponse<boolean>> {

    const rb = new RequestBuilder(this.rootUrl, ProfileService.ProfileGetDoesUserExistsPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: String((r as HttpResponse<any>).body) === 'true' }) as StrictHttpResponse<boolean>;
      })
    );
  }

  /**
   * check if user exists or not.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `profileGetDoesUserExists$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  profileGetDoesUserExists(params?: {
  }): Observable<boolean> {

    return this.profileGetDoesUserExists$Response(params).pipe(
      map((r: StrictHttpResponse<boolean>) => r.body as boolean)
    );
  }

  /**
   * Path part for operation profileGetProfileConflicts
   */
  static readonly ProfileGetProfileConflictsPath = '/api/profiles/current/conflicts';

  /**
   * Get the logged in user's profile and conflicts with the data that came from the authenticating identity provider.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `profileGetProfileConflicts()` instead.
   *
   * This method doesn't expect any request body.
   */
  profileGetProfileConflicts$Response(params?: {
  }): Observable<StrictHttpResponse<Array<ProfileDataConflict>>> {

    const rb = new RequestBuilder(this.rootUrl, ProfileService.ProfileGetProfileConflictsPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<ProfileDataConflict>>;
      })
    );
  }

  /**
   * Get the logged in user's profile and conflicts with the data that came from the authenticating identity provider.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `profileGetProfileConflicts$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  profileGetProfileConflicts(params?: {
  }): Observable<Array<ProfileDataConflict>> {

    return this.profileGetProfileConflicts$Response(params).pipe(
      map((r: StrictHttpResponse<Array<ProfileDataConflict>>) => r.body as Array<ProfileDataConflict>)
    );
  }

  /**
   * Path part for operation profileInvite
   */
  static readonly ProfileInvitePath = '/api/profiles/invite-anonymous';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `profileInvite()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  profileInvite$Response(params: {
    body: InviteRequest
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ProfileService.ProfileInvitePath, 'post');
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
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `profileInvite$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  profileInvite(params: {
    body: InviteRequest
  }): Observable<void> {

    return this.profileInvite$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation profileProcessInvite
   */
  static readonly ProfileProcessInvitePath = '/api/profiles/current/join';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `profileProcessInvite()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  profileProcessInvite$Response(params: {
    body: InviteToken
  }): Observable<StrictHttpResponse<boolean>> {

    const rb = new RequestBuilder(this.rootUrl, ProfileService.ProfileProcessInvitePath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: String((r as HttpResponse<any>).body) === 'true' }) as StrictHttpResponse<boolean>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `profileProcessInvite$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  profileProcessInvite(params: {
    body: InviteToken
  }): Observable<boolean> {

    return this.profileProcessInvite$Response(params).pipe(
      map((r: StrictHttpResponse<boolean>) => r.body as boolean)
    );
  }

}
