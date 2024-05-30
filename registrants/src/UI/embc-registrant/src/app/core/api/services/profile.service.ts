/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { AddressDataConflict } from '../models/address-data-conflict';
import { DateOfBirthDataConflict } from '../models/date-of-birth-data-conflict';
import { NameDataConflict } from '../models/name-data-conflict';
import { Profile } from '../models/profile';
import { profileGetDoesUserExists } from '../fn/profile/profile-get-does-user-exists';
import { ProfileGetDoesUserExists$Params } from '../fn/profile/profile-get-does-user-exists';
import { profileGetProfile } from '../fn/profile/profile-get-profile';
import { ProfileGetProfile$Params } from '../fn/profile/profile-get-profile';
import { profileGetProfileConflicts } from '../fn/profile/profile-get-profile-conflicts';
import { ProfileGetProfileConflicts$Params } from '../fn/profile/profile-get-profile-conflicts';
import { profileInvite } from '../fn/profile/profile-invite';
import { ProfileInvite$Params } from '../fn/profile/profile-invite';
import { profileProcessInvite } from '../fn/profile/profile-process-invite';
import { ProfileProcessInvite$Params } from '../fn/profile/profile-process-invite';
import { profileUpsert } from '../fn/profile/profile-upsert';
import { ProfileUpsert$Params } from '../fn/profile/profile-upsert';

@Injectable({ providedIn: 'root' })
export class ProfileService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `profileGetProfile()` */
  static readonly ProfileGetProfilePath = '/api/profiles/current';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `profileGetProfile()` instead.
   *
   * This method doesn't expect any request body.
   */
  profileGetProfile$Response(
    params?: ProfileGetProfile$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<Profile>> {
    return profileGetProfile(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `profileGetProfile$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  profileGetProfile(params?: ProfileGetProfile$Params, context?: HttpContext): Observable<Profile> {
    return this.profileGetProfile$Response(params, context).pipe(
      map((r: StrictHttpResponse<Profile>): Profile => r.body)
    );
  }

  /** Path part for operation `profileUpsert()` */
  static readonly ProfileUpsertPath = '/api/profiles/current';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `profileUpsert()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  profileUpsert$Response(params?: ProfileUpsert$Params, context?: HttpContext): Observable<StrictHttpResponse<string>> {
    return profileUpsert(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `profileUpsert$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  profileUpsert(params?: ProfileUpsert$Params, context?: HttpContext): Observable<string> {
    return this.profileUpsert$Response(params, context).pipe(map((r: StrictHttpResponse<string>): string => r.body));
  }

  /** Path part for operation `profileGetDoesUserExists()` */
  static readonly ProfileGetDoesUserExistsPath = '/api/profiles/current/exists';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `profileGetDoesUserExists()` instead.
   *
   * This method doesn't expect any request body.
   */
  profileGetDoesUserExists$Response(
    params?: ProfileGetDoesUserExists$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<boolean>> {
    return profileGetDoesUserExists(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `profileGetDoesUserExists$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  profileGetDoesUserExists(params?: ProfileGetDoesUserExists$Params, context?: HttpContext): Observable<boolean> {
    return this.profileGetDoesUserExists$Response(params, context).pipe(
      map((r: StrictHttpResponse<boolean>): boolean => r.body)
    );
  }

  /** Path part for operation `profileGetProfileConflicts()` */
  static readonly ProfileGetProfileConflictsPath = '/api/profiles/current/conflicts';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `profileGetProfileConflicts()` instead.
   *
   * This method doesn't expect any request body.
   */
  profileGetProfileConflicts$Response(
    params?: ProfileGetProfileConflicts$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<Array<DateOfBirthDataConflict | NameDataConflict | AddressDataConflict>>> {
    return profileGetProfileConflicts(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `profileGetProfileConflicts$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  profileGetProfileConflicts(
    params?: ProfileGetProfileConflicts$Params,
    context?: HttpContext
  ): Observable<Array<DateOfBirthDataConflict | NameDataConflict | AddressDataConflict>> {
    return this.profileGetProfileConflicts$Response(params, context).pipe(
      map(
        (
          r: StrictHttpResponse<Array<DateOfBirthDataConflict | NameDataConflict | AddressDataConflict>>
        ): Array<DateOfBirthDataConflict | NameDataConflict | AddressDataConflict> => r.body
      )
    );
  }

  /** Path part for operation `profileInvite()` */
  static readonly ProfileInvitePath = '/api/profiles/invite-anonymous';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `profileInvite()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  profileInvite$Response(params?: ProfileInvite$Params, context?: HttpContext): Observable<StrictHttpResponse<void>> {
    return profileInvite(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `profileInvite$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  profileInvite(params?: ProfileInvite$Params, context?: HttpContext): Observable<void> {
    return this.profileInvite$Response(params, context).pipe(map((r: StrictHttpResponse<void>): void => r.body));
  }

  /** Path part for operation `profileProcessInvite()` */
  static readonly ProfileProcessInvitePath = '/api/profiles/current/join';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `profileProcessInvite()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  profileProcessInvite$Response(
    params?: ProfileProcessInvite$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<boolean>> {
    return profileProcessInvite(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `profileProcessInvite$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  profileProcessInvite(params?: ProfileProcessInvite$Params, context?: HttpContext): Observable<boolean> {
    return this.profileProcessInvite$Response(params, context).pipe(
      map((r: StrictHttpResponse<boolean>): boolean => r.body)
    );
  }
}
