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

import { MemberLabel } from '../models/member-label';
import { MemberRole } from '../models/member-role';
import { TeamMember } from '../models/team-member';

@Injectable({
  providedIn: 'root',
})
export class TeamMembersService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation teamMembersGetTeamMembers
   */
  static readonly TeamMembersGetTeamMembersPath = '/api/team/members';

  /**
   * Get all team members.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `teamMembersGetTeamMembers()` instead.
   *
   * This method doesn't expect any request body.
   */
  teamMembersGetTeamMembers$Response(params?: {
  }): Observable<StrictHttpResponse<Array<TeamMember>>> {

    const rb = new RequestBuilder(this.rootUrl, TeamMembersService.TeamMembersGetTeamMembersPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<TeamMember>>;
      })
    );
  }

  /**
   * Get all team members.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `teamMembersGetTeamMembers$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  teamMembersGetTeamMembers(params?: {
  }): Observable<Array<TeamMember>> {

    return this.teamMembersGetTeamMembers$Response(params).pipe(
      map((r: StrictHttpResponse<Array<TeamMember>>) => r.body as Array<TeamMember>)
    );
  }

  /**
   * Path part for operation teamMembersCreateTeamMember
   */
  static readonly TeamMembersCreateTeamMemberPath = '/api/team/members';

  /**
   * Creates a new team member.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `teamMembersCreateTeamMember()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  teamMembersCreateTeamMember$Response(params: {

    /**
     * team member
     */
    body: TeamMember
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, TeamMembersService.TeamMembersCreateTeamMemberPath, 'post');
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
   * Creates a new team member.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `teamMembersCreateTeamMember$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  teamMembersCreateTeamMember(params: {

    /**
     * team member
     */
    body: TeamMember
  }): Observable<void> {

    return this.teamMembersCreateTeamMember$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation teamMembersGetTeamMember
   */
  static readonly TeamMembersGetTeamMemberPath = '/api/team/members/{memberId}';

  /**
   * Get a single team member.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `teamMembersGetTeamMember()` instead.
   *
   * This method doesn't expect any request body.
   */
  teamMembersGetTeamMember$Response(params: {

    /**
     * team member id
     */
    memberId: string;
  }): Observable<StrictHttpResponse<TeamMember>> {

    const rb = new RequestBuilder(this.rootUrl, TeamMembersService.TeamMembersGetTeamMemberPath, 'get');
    if (params) {
      rb.path('memberId', params.memberId, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<TeamMember>;
      })
    );
  }

  /**
   * Get a single team member.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `teamMembersGetTeamMember$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  teamMembersGetTeamMember(params: {

    /**
     * team member id
     */
    memberId: string;
  }): Observable<TeamMember> {

    return this.teamMembersGetTeamMember$Response(params).pipe(
      map((r: StrictHttpResponse<TeamMember>) => r.body as TeamMember)
    );
  }

  /**
   * Path part for operation teamMembersUpdateTeamMember
   */
  static readonly TeamMembersUpdateTeamMemberPath = '/api/team/members/{memberId}';

  /**
   * Updates team member.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `teamMembersUpdateTeamMember()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  teamMembersUpdateTeamMember$Response(params: {

    /**
     * team member id to update
     */
    memberId: string;

    /**
     * team member
     */
    body: TeamMember
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, TeamMembersService.TeamMembersUpdateTeamMemberPath, 'post');
    if (params) {
      rb.path('memberId', params.memberId, {});
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
   * Updates team member.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `teamMembersUpdateTeamMember$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  teamMembersUpdateTeamMember(params: {

    /**
     * team member id to update
     */
    memberId: string;

    /**
     * team member
     */
    body: TeamMember
  }): Observable<void> {

    return this.teamMembersUpdateTeamMember$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation teamMembersDeleteTeamMember
   */
  static readonly TeamMembersDeleteTeamMemberPath = '/api/team/members/{memberId}';

  /**
   * Delete a team member.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `teamMembersDeleteTeamMember()` instead.
   *
   * This method doesn't expect any request body.
   */
  teamMembersDeleteTeamMember$Response(params: {

    /**
     * team member id
     */
    memberId: string;
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, TeamMembersService.TeamMembersDeleteTeamMemberPath, 'delete');
    if (params) {
      rb.path('memberId', params.memberId, {});
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
   * Delete a team member.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `teamMembersDeleteTeamMember$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  teamMembersDeleteTeamMember(params: {

    /**
     * team member id
     */
    memberId: string;
  }): Observable<void> {

    return this.teamMembersDeleteTeamMember$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation teamMembersDeactivateTeamMember
   */
  static readonly TeamMembersDeactivateTeamMemberPath = '/api/team/members/{memberId}/active';

  /**
   * Deactivate a team member.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `teamMembersDeactivateTeamMember()` instead.
   *
   * This method doesn't expect any request body.
   */
  teamMembersDeactivateTeamMember$Response(params: {

    /**
     * team member id
     */
    memberId: string;
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, TeamMembersService.TeamMembersDeactivateTeamMemberPath, 'post');
    if (params) {
      rb.path('memberId', params.memberId, {});
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
   * Deactivate a team member.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `teamMembersDeactivateTeamMember$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  teamMembersDeactivateTeamMember(params: {

    /**
     * team member id
     */
    memberId: string;
  }): Observable<void> {

    return this.teamMembersDeactivateTeamMember$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation teamMembersActivateTeamMember
   */
  static readonly TeamMembersActivateTeamMemberPath = '/api/team/members/{memberId}/inactive';

  /**
   * Activate a team member.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `teamMembersActivateTeamMember()` instead.
   *
   * This method doesn't expect any request body.
   */
  teamMembersActivateTeamMember$Response(params: {

    /**
     * team member id
     */
    memberId: string;
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, TeamMembersService.TeamMembersActivateTeamMemberPath, 'post');
    if (params) {
      rb.path('memberId', params.memberId, {});
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
   * Activate a team member.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `teamMembersActivateTeamMember$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  teamMembersActivateTeamMember(params: {

    /**
     * team member id
     */
    memberId: string;
  }): Observable<void> {

    return this.teamMembersActivateTeamMember$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation teamMembersIsUserNameExists
   */
  static readonly TeamMembersIsUserNameExistsPath = '/api/team/members/username';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `teamMembersIsUserNameExists()` instead.
   *
   * This method doesn't expect any request body.
   */
  teamMembersIsUserNameExists$Response(params?: {
    userName?: string;
  }): Observable<StrictHttpResponse<boolean>> {

    const rb = new RequestBuilder(this.rootUrl, TeamMembersService.TeamMembersIsUserNameExistsPath, 'get');
    if (params) {
      rb.query('userName', params.userName, {});
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
   * To access the full response (for headers, for example), `teamMembersIsUserNameExists$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  teamMembersIsUserNameExists(params?: {
    userName?: string;
  }): Observable<boolean> {

    return this.teamMembersIsUserNameExists$Response(params).pipe(
      map((r: StrictHttpResponse<boolean>) => r.body as boolean)
    );
  }

  /**
   * Path part for operation teamMembersGetMemberRoles
   */
  static readonly TeamMembersGetMemberRolesPath = '/api/team/members/memberroles';

  /**
   * Provides a list of team member roles.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `teamMembersGetMemberRoles()` instead.
   *
   * This method doesn't expect any request body.
   */
  teamMembersGetMemberRoles$Response(params?: {
  }): Observable<StrictHttpResponse<Array<MemberRole>>> {

    const rb = new RequestBuilder(this.rootUrl, TeamMembersService.TeamMembersGetMemberRolesPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<MemberRole>>;
      })
    );
  }

  /**
   * Provides a list of team member roles.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `teamMembersGetMemberRoles$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  teamMembersGetMemberRoles(params?: {
  }): Observable<Array<MemberRole>> {

    return this.teamMembersGetMemberRoles$Response(params).pipe(
      map((r: StrictHttpResponse<Array<MemberRole>>) => r.body as Array<MemberRole>)
    );
  }

  /**
   * Path part for operation teamMembersGetMemberLabels
   */
  static readonly TeamMembersGetMemberLabelsPath = '/api/team/members/memberlabels';

  /**
   * Provides a list of team member labels.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `teamMembersGetMemberLabels()` instead.
   *
   * This method doesn't expect any request body.
   */
  teamMembersGetMemberLabels$Response(params?: {
  }): Observable<StrictHttpResponse<Array<MemberLabel>>> {

    const rb = new RequestBuilder(this.rootUrl, TeamMembersService.TeamMembersGetMemberLabelsPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<MemberLabel>>;
      })
    );
  }

  /**
   * Provides a list of team member labels.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `teamMembersGetMemberLabels$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  teamMembersGetMemberLabels(params?: {
  }): Observable<Array<MemberLabel>> {

    return this.teamMembersGetMemberLabels$Response(params).pipe(
      map((r: StrictHttpResponse<Array<MemberLabel>>) => r.body as Array<MemberLabel>)
    );
  }

}
