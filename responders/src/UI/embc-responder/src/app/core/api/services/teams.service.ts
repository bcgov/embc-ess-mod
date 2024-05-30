/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { MemberLabelDescription } from '../models/member-label-description';
import { MemberRoleDescription } from '../models/member-role-description';
import { Team } from '../models/team';
import { TeamMember } from '../models/team-member';
import { TeamMemberResult } from '../models/team-member-result';
import { teamsActivateTeamMember } from '../fn/teams/teams-activate-team-member';
import { TeamsActivateTeamMember$Params } from '../fn/teams/teams-activate-team-member';
import { teamsCreateTeamMember } from '../fn/teams/teams-create-team-member';
import { TeamsCreateTeamMember$Params } from '../fn/teams/teams-create-team-member';
import { teamsDeactivateTeamMember } from '../fn/teams/teams-deactivate-team-member';
import { TeamsDeactivateTeamMember$Params } from '../fn/teams/teams-deactivate-team-member';
import { teamsDeleteTeamMember } from '../fn/teams/teams-delete-team-member';
import { TeamsDeleteTeamMember$Params } from '../fn/teams/teams-delete-team-member';
import { teamsGetMemberLabels } from '../fn/teams/teams-get-member-labels';
import { TeamsGetMemberLabels$Params } from '../fn/teams/teams-get-member-labels';
import { teamsGetMemberRoles } from '../fn/teams/teams-get-member-roles';
import { TeamsGetMemberRoles$Params } from '../fn/teams/teams-get-member-roles';
import { teamsGetTeamMember } from '../fn/teams/teams-get-team-member';
import { TeamsGetTeamMember$Params } from '../fn/teams/teams-get-team-member';
import { teamsGetTeamMembers } from '../fn/teams/teams-get-team-members';
import { TeamsGetTeamMembers$Params } from '../fn/teams/teams-get-team-members';
import { teamsGetTeams } from '../fn/teams/teams-get-teams';
import { TeamsGetTeams$Params } from '../fn/teams/teams-get-teams';
import { teamsGetTeamsByCommunity } from '../fn/teams/teams-get-teams-by-community';
import { TeamsGetTeamsByCommunity$Params } from '../fn/teams/teams-get-teams-by-community';
import { teamsIsUserNameExists } from '../fn/teams/teams-is-user-name-exists';
import { TeamsIsUserNameExists$Params } from '../fn/teams/teams-is-user-name-exists';
import { teamsUpdateTeamMember } from '../fn/teams/teams-update-team-member';
import { TeamsUpdateTeamMember$Params } from '../fn/teams/teams-update-team-member';

@Injectable({ providedIn: 'root' })
export class TeamsService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `teamsGetTeams()` */
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
  teamsGetTeams$Response(
    params?: TeamsGetTeams$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<Array<Team>>> {
    return teamsGetTeams(this.http, this.rootUrl, params, context);
  }

  /**
   * Get all teams.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `teamsGetTeams$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  teamsGetTeams(params?: TeamsGetTeams$Params, context?: HttpContext): Observable<Array<Team>> {
    return this.teamsGetTeams$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<Team>>): Array<Team> => r.body)
    );
  }

  /** Path part for operation `teamsGetTeamsByCommunity()` */
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
  teamsGetTeamsByCommunity$Response(
    params: TeamsGetTeamsByCommunity$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<Array<Team>>> {
    return teamsGetTeamsByCommunity(this.http, this.rootUrl, params, context);
  }

  /**
   * Get teams by community.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `teamsGetTeamsByCommunity$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  teamsGetTeamsByCommunity(params: TeamsGetTeamsByCommunity$Params, context?: HttpContext): Observable<Array<Team>> {
    return this.teamsGetTeamsByCommunity$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<Team>>): Array<Team> => r.body)
    );
  }

  /** Path part for operation `teamsGetTeamMembers()` */
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
  teamsGetTeamMembers$Response(
    params?: TeamsGetTeamMembers$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<Array<TeamMember>>> {
    return teamsGetTeamMembers(this.http, this.rootUrl, params, context);
  }

  /**
   * Get all team members.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `teamsGetTeamMembers$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  teamsGetTeamMembers(params?: TeamsGetTeamMembers$Params, context?: HttpContext): Observable<Array<TeamMember>> {
    return this.teamsGetTeamMembers$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<TeamMember>>): Array<TeamMember> => r.body)
    );
  }

  /** Path part for operation `teamsCreateTeamMember()` */
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
  teamsCreateTeamMember$Response(
    params: TeamsCreateTeamMember$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<TeamMemberResult>> {
    return teamsCreateTeamMember(this.http, this.rootUrl, params, context);
  }

  /**
   * Creates a new team member.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `teamsCreateTeamMember$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  teamsCreateTeamMember(params: TeamsCreateTeamMember$Params, context?: HttpContext): Observable<TeamMemberResult> {
    return this.teamsCreateTeamMember$Response(params, context).pipe(
      map((r: StrictHttpResponse<TeamMemberResult>): TeamMemberResult => r.body)
    );
  }

  /** Path part for operation `teamsGetTeamMember()` */
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
  teamsGetTeamMember$Response(
    params: TeamsGetTeamMember$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<TeamMember>> {
    return teamsGetTeamMember(this.http, this.rootUrl, params, context);
  }

  /**
   * Get a single team member.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `teamsGetTeamMember$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  teamsGetTeamMember(params: TeamsGetTeamMember$Params, context?: HttpContext): Observable<TeamMember> {
    return this.teamsGetTeamMember$Response(params, context).pipe(
      map((r: StrictHttpResponse<TeamMember>): TeamMember => r.body)
    );
  }

  /** Path part for operation `teamsUpdateTeamMember()` */
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
  teamsUpdateTeamMember$Response(
    params: TeamsUpdateTeamMember$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<TeamMemberResult>> {
    return teamsUpdateTeamMember(this.http, this.rootUrl, params, context);
  }

  /**
   * Updates team member.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `teamsUpdateTeamMember$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  teamsUpdateTeamMember(params: TeamsUpdateTeamMember$Params, context?: HttpContext): Observable<TeamMemberResult> {
    return this.teamsUpdateTeamMember$Response(params, context).pipe(
      map((r: StrictHttpResponse<TeamMemberResult>): TeamMemberResult => r.body)
    );
  }

  /** Path part for operation `teamsDeleteTeamMember()` */
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
  teamsDeleteTeamMember$Response(
    params: TeamsDeleteTeamMember$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<TeamMemberResult>> {
    return teamsDeleteTeamMember(this.http, this.rootUrl, params, context);
  }

  /**
   * Delete a team member.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `teamsDeleteTeamMember$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  teamsDeleteTeamMember(params: TeamsDeleteTeamMember$Params, context?: HttpContext): Observable<TeamMemberResult> {
    return this.teamsDeleteTeamMember$Response(params, context).pipe(
      map((r: StrictHttpResponse<TeamMemberResult>): TeamMemberResult => r.body)
    );
  }

  /** Path part for operation `teamsActivateTeamMember()` */
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
  teamsActivateTeamMember$Response(
    params: TeamsActivateTeamMember$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<TeamMemberResult>> {
    return teamsActivateTeamMember(this.http, this.rootUrl, params, context);
  }

  /**
   * Activate a team member.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `teamsActivateTeamMember$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  teamsActivateTeamMember(params: TeamsActivateTeamMember$Params, context?: HttpContext): Observable<TeamMemberResult> {
    return this.teamsActivateTeamMember$Response(params, context).pipe(
      map((r: StrictHttpResponse<TeamMemberResult>): TeamMemberResult => r.body)
    );
  }

  /** Path part for operation `teamsDeactivateTeamMember()` */
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
  teamsDeactivateTeamMember$Response(
    params: TeamsDeactivateTeamMember$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<void>> {
    return teamsDeactivateTeamMember(this.http, this.rootUrl, params, context);
  }

  /**
   * Deactivate a team member.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `teamsDeactivateTeamMember$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  teamsDeactivateTeamMember(params: TeamsDeactivateTeamMember$Params, context?: HttpContext): Observable<void> {
    return this.teamsDeactivateTeamMember$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

  /** Path part for operation `teamsIsUserNameExists()` */
  static readonly TeamsIsUserNameExistsPath = '/api/team/members/username';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `teamsIsUserNameExists()` instead.
   *
   * This method doesn't expect any request body.
   */
  teamsIsUserNameExists$Response(
    params?: TeamsIsUserNameExists$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<boolean>> {
    return teamsIsUserNameExists(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `teamsIsUserNameExists$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  teamsIsUserNameExists(params?: TeamsIsUserNameExists$Params, context?: HttpContext): Observable<boolean> {
    return this.teamsIsUserNameExists$Response(params, context).pipe(
      map((r: StrictHttpResponse<boolean>): boolean => r.body)
    );
  }

  /** Path part for operation `teamsGetMemberRoles()` */
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
  teamsGetMemberRoles$Response(
    params?: TeamsGetMemberRoles$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<Array<MemberRoleDescription>>> {
    return teamsGetMemberRoles(this.http, this.rootUrl, params, context);
  }

  /**
   * Provides a list of team member roles.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `teamsGetMemberRoles$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  teamsGetMemberRoles(
    params?: TeamsGetMemberRoles$Params,
    context?: HttpContext
  ): Observable<Array<MemberRoleDescription>> {
    return this.teamsGetMemberRoles$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<MemberRoleDescription>>): Array<MemberRoleDescription> => r.body)
    );
  }

  /** Path part for operation `teamsGetMemberLabels()` */
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
  teamsGetMemberLabels$Response(
    params?: TeamsGetMemberLabels$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<Array<MemberLabelDescription>>> {
    return teamsGetMemberLabels(this.http, this.rootUrl, params, context);
  }

  /**
   * Provides a list of team member labels.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `teamsGetMemberLabels$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  teamsGetMemberLabels(
    params?: TeamsGetMemberLabels$Params,
    context?: HttpContext
  ): Observable<Array<MemberLabelDescription>> {
    return this.teamsGetMemberLabels$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<MemberLabelDescription>>): Array<MemberLabelDescription> => r.body)
    );
  }
}
