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

import { MemberLabelDescription } from '../models/member-label-description';
import { MemberRoleDescription } from '../models/member-role-description';
import { Team } from '../models/team';
import { TeamMember } from '../models/team-member';
import { TeamMemberResult } from '../models/team-member-result';

@Injectable({
  providedIn: 'root',
})
export class TeamsService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation teamsGetTeams
   */
  static readonly TeamsGetTeamsPath = '/api/team';

  /**
   * Get all teams.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `teamsGetTeams()` instead.
   *
   * This method doesn't expect any request body.
   */
  teamsGetTeams$Response(params?: {
  }): Observable<StrictHttpResponse<Array<Team>>> {

    const rb = new RequestBuilder(this.rootUrl, TeamsService.TeamsGetTeamsPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<Team>>;
      })
    );
  }

  /**
   * Get all teams.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `teamsGetTeams$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  teamsGetTeams(params?: {
  }): Observable<Array<Team>> {

    return this.teamsGetTeams$Response(params).pipe(
      map((r: StrictHttpResponse<Array<Team>>) => r.body as Array<Team>)
    );
  }

  /**
   * Path part for operation teamsGetTeamsByCommunity
   */
  static readonly TeamsGetTeamsByCommunityPath = '/api/team/community/{communityCode}';

  /**
   * Get teams by community.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `teamsGetTeamsByCommunity()` instead.
   *
   * This method doesn't expect any request body.
   */
  teamsGetTeamsByCommunity$Response(params: {

    /**
     * communityCode
     */
    communityCode: string;
  }): Observable<StrictHttpResponse<Array<Team>>> {

    const rb = new RequestBuilder(this.rootUrl, TeamsService.TeamsGetTeamsByCommunityPath, 'get');
    if (params) {
      rb.path('communityCode', params.communityCode, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<Team>>;
      })
    );
  }

  /**
   * Get teams by community.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `teamsGetTeamsByCommunity$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  teamsGetTeamsByCommunity(params: {

    /**
     * communityCode
     */
    communityCode: string;
  }): Observable<Array<Team>> {

    return this.teamsGetTeamsByCommunity$Response(params).pipe(
      map((r: StrictHttpResponse<Array<Team>>) => r.body as Array<Team>)
    );
  }

  /**
   * Path part for operation teamsGetTeamMembers
   */
  static readonly TeamsGetTeamMembersPath = '/api/team/members';

  /**
   * Get all team members.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `teamsGetTeamMembers()` instead.
   *
   * This method doesn't expect any request body.
   */
  teamsGetTeamMembers$Response(params?: {
  }): Observable<StrictHttpResponse<Array<TeamMember>>> {

    const rb = new RequestBuilder(this.rootUrl, TeamsService.TeamsGetTeamMembersPath, 'get');
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
   * To access the full response (for headers, for example), `teamsGetTeamMembers$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  teamsGetTeamMembers(params?: {
  }): Observable<Array<TeamMember>> {

    return this.teamsGetTeamMembers$Response(params).pipe(
      map((r: StrictHttpResponse<Array<TeamMember>>) => r.body as Array<TeamMember>)
    );
  }

  /**
   * Path part for operation teamsCreateTeamMember
   */
  static readonly TeamsCreateTeamMemberPath = '/api/team/members';

  /**
   * Creates a new team member.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `teamsCreateTeamMember()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  teamsCreateTeamMember$Response(params: {

    /**
     * team member
     */
    body: TeamMember
  }): Observable<StrictHttpResponse<TeamMemberResult>> {

    const rb = new RequestBuilder(this.rootUrl, TeamsService.TeamsCreateTeamMemberPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<TeamMemberResult>;
      })
    );
  }

  /**
   * Creates a new team member.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `teamsCreateTeamMember$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  teamsCreateTeamMember(params: {

    /**
     * team member
     */
    body: TeamMember
  }): Observable<TeamMemberResult> {

    return this.teamsCreateTeamMember$Response(params).pipe(
      map((r: StrictHttpResponse<TeamMemberResult>) => r.body as TeamMemberResult)
    );
  }

  /**
   * Path part for operation teamsGetTeamMember
   */
  static readonly TeamsGetTeamMemberPath = '/api/team/members/{memberId}';

  /**
   * Get a single team member.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `teamsGetTeamMember()` instead.
   *
   * This method doesn't expect any request body.
   */
  teamsGetTeamMember$Response(params: {

    /**
     * team member id
     */
    memberId: string;
  }): Observable<StrictHttpResponse<TeamMember>> {

    const rb = new RequestBuilder(this.rootUrl, TeamsService.TeamsGetTeamMemberPath, 'get');
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
   * To access the full response (for headers, for example), `teamsGetTeamMember$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  teamsGetTeamMember(params: {

    /**
     * team member id
     */
    memberId: string;
  }): Observable<TeamMember> {

    return this.teamsGetTeamMember$Response(params).pipe(
      map((r: StrictHttpResponse<TeamMember>) => r.body as TeamMember)
    );
  }

  /**
   * Path part for operation teamsUpdateTeamMember
   */
  static readonly TeamsUpdateTeamMemberPath = '/api/team/members/{memberId}';

  /**
   * Updates team member.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `teamsUpdateTeamMember()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  teamsUpdateTeamMember$Response(params: {

    /**
     * team member id to update
     */
    memberId: string;

    /**
     * team member
     */
    body: TeamMember
  }): Observable<StrictHttpResponse<TeamMemberResult>> {

    const rb = new RequestBuilder(this.rootUrl, TeamsService.TeamsUpdateTeamMemberPath, 'post');
    if (params) {
      rb.path('memberId', params.memberId, {});
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<TeamMemberResult>;
      })
    );
  }

  /**
   * Updates team member.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `teamsUpdateTeamMember$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  teamsUpdateTeamMember(params: {

    /**
     * team member id to update
     */
    memberId: string;

    /**
     * team member
     */
    body: TeamMember
  }): Observable<TeamMemberResult> {

    return this.teamsUpdateTeamMember$Response(params).pipe(
      map((r: StrictHttpResponse<TeamMemberResult>) => r.body as TeamMemberResult)
    );
  }

  /**
   * Path part for operation teamsDeleteTeamMember
   */
  static readonly TeamsDeleteTeamMemberPath = '/api/team/members/{memberId}';

  /**
   * Delete a team member.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `teamsDeleteTeamMember()` instead.
   *
   * This method doesn't expect any request body.
   */
  teamsDeleteTeamMember$Response(params: {

    /**
     * team member id
     */
    memberId: string;
  }): Observable<StrictHttpResponse<TeamMemberResult>> {

    const rb = new RequestBuilder(this.rootUrl, TeamsService.TeamsDeleteTeamMemberPath, 'delete');
    if (params) {
      rb.path('memberId', params.memberId, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<TeamMemberResult>;
      })
    );
  }

  /**
   * Delete a team member.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `teamsDeleteTeamMember$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  teamsDeleteTeamMember(params: {

    /**
     * team member id
     */
    memberId: string;
  }): Observable<TeamMemberResult> {

    return this.teamsDeleteTeamMember$Response(params).pipe(
      map((r: StrictHttpResponse<TeamMemberResult>) => r.body as TeamMemberResult)
    );
  }

  /**
   * Path part for operation teamsActivateTeamMember
   */
  static readonly TeamsActivateTeamMemberPath = '/api/team/members/{memberId}/active';

  /**
   * Activate a team member.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `teamsActivateTeamMember()` instead.
   *
   * This method doesn't expect any request body.
   */
  teamsActivateTeamMember$Response(params: {

    /**
     * team member id
     */
    memberId: string;
  }): Observable<StrictHttpResponse<TeamMemberResult>> {

    const rb = new RequestBuilder(this.rootUrl, TeamsService.TeamsActivateTeamMemberPath, 'post');
    if (params) {
      rb.path('memberId', params.memberId, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<TeamMemberResult>;
      })
    );
  }

  /**
   * Activate a team member.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `teamsActivateTeamMember$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  teamsActivateTeamMember(params: {

    /**
     * team member id
     */
    memberId: string;
  }): Observable<TeamMemberResult> {

    return this.teamsActivateTeamMember$Response(params).pipe(
      map((r: StrictHttpResponse<TeamMemberResult>) => r.body as TeamMemberResult)
    );
  }

  /**
   * Path part for operation teamsDeactivateTeamMember
   */
  static readonly TeamsDeactivateTeamMemberPath = '/api/team/members/{memberId}/inactive';

  /**
   * Deactivate a team member.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `teamsDeactivateTeamMember()` instead.
   *
   * This method doesn't expect any request body.
   */
  teamsDeactivateTeamMember$Response(params: {

    /**
     * team member id
     */
    memberId: string;
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, TeamsService.TeamsDeactivateTeamMemberPath, 'post');
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
   * To access the full response (for headers, for example), `teamsDeactivateTeamMember$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  teamsDeactivateTeamMember(params: {

    /**
     * team member id
     */
    memberId: string;
  }): Observable<void> {

    return this.teamsDeactivateTeamMember$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation teamsIsUserNameExists
   */
  static readonly TeamsIsUserNameExistsPath = '/api/team/members/username';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `teamsIsUserNameExists()` instead.
   *
   * This method doesn't expect any request body.
   */
  teamsIsUserNameExists$Response(params?: {
    userName?: string;
    memberId?: string;
  }): Observable<StrictHttpResponse<boolean>> {

    const rb = new RequestBuilder(this.rootUrl, TeamsService.TeamsIsUserNameExistsPath, 'get');
    if (params) {
      rb.query('userName', params.userName, {});
      rb.query('memberId', params.memberId, {});
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
   * To access the full response (for headers, for example), `teamsIsUserNameExists$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  teamsIsUserNameExists(params?: {
    userName?: string;
    memberId?: string;
  }): Observable<boolean> {

    return this.teamsIsUserNameExists$Response(params).pipe(
      map((r: StrictHttpResponse<boolean>) => r.body as boolean)
    );
  }

  /**
   * Path part for operation teamsGetMemberRoles
   */
  static readonly TeamsGetMemberRolesPath = '/api/team/members/codes/memberrole';

  /**
   * Provides a list of team member roles.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `teamsGetMemberRoles()` instead.
   *
   * This method doesn't expect any request body.
   */
  teamsGetMemberRoles$Response(params?: {
  }): Observable<StrictHttpResponse<Array<MemberRoleDescription>>> {

    const rb = new RequestBuilder(this.rootUrl, TeamsService.TeamsGetMemberRolesPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<MemberRoleDescription>>;
      })
    );
  }

  /**
   * Provides a list of team member roles.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `teamsGetMemberRoles$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  teamsGetMemberRoles(params?: {
  }): Observable<Array<MemberRoleDescription>> {

    return this.teamsGetMemberRoles$Response(params).pipe(
      map((r: StrictHttpResponse<Array<MemberRoleDescription>>) => r.body as Array<MemberRoleDescription>)
    );
  }

  /**
   * Path part for operation teamsGetMemberLabels
   */
  static readonly TeamsGetMemberLabelsPath = '/api/team/members/codes/memberlabel';

  /**
   * Provides a list of team member labels.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `teamsGetMemberLabels()` instead.
   *
   * This method doesn't expect any request body.
   */
  teamsGetMemberLabels$Response(params?: {
  }): Observable<StrictHttpResponse<Array<MemberLabelDescription>>> {

    const rb = new RequestBuilder(this.rootUrl, TeamsService.TeamsGetMemberLabelsPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<MemberLabelDescription>>;
      })
    );
  }

  /**
   * Provides a list of team member labels.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `teamsGetMemberLabels$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  teamsGetMemberLabels(params?: {
  }): Observable<Array<MemberLabelDescription>> {

    return this.teamsGetMemberLabels$Response(params).pipe(
      map((r: StrictHttpResponse<Array<MemberLabelDescription>>) => r.body as Array<MemberLabelDescription>)
    );
  }

}
