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

import { AssignedCommunity } from '../models/assigned-community';

@Injectable({
  providedIn: 'root',
})
export class TeamCommunitiesAssignmentsService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation teamCommunitiesAssignmentsGetAssignedCommunities
   */
  static readonly TeamCommunitiesAssignmentsGetAssignedCommunitiesPath = '/api/team/communities';

  /**
   * Get all assigned communities.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `teamCommunitiesAssignmentsGetAssignedCommunities()` instead.
   *
   * This method doesn't expect any request body.
   */
  teamCommunitiesAssignmentsGetAssignedCommunities$Response(params?: {

    /**
     * indicates if a list of communities assigned to all teams should be returned
     */
    forAllTeams?: boolean;
  }): Observable<StrictHttpResponse<Array<AssignedCommunity>>> {

    const rb = new RequestBuilder(this.rootUrl, TeamCommunitiesAssignmentsService.TeamCommunitiesAssignmentsGetAssignedCommunitiesPath, 'get');
    if (params) {
      rb.query('forAllTeams', params.forAllTeams, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<AssignedCommunity>>;
      })
    );
  }

  /**
   * Get all assigned communities.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `teamCommunitiesAssignmentsGetAssignedCommunities$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  teamCommunitiesAssignmentsGetAssignedCommunities(params?: {

    /**
     * indicates if a list of communities assigned to all teams should be returned
     */
    forAllTeams?: boolean;
  }): Observable<Array<AssignedCommunity>> {

    return this.teamCommunitiesAssignmentsGetAssignedCommunities$Response(params).pipe(
      map((r: StrictHttpResponse<Array<AssignedCommunity>>) => r.body as Array<AssignedCommunity>)
    );
  }

  /**
   * Path part for operation teamCommunitiesAssignmentsAssignCommunities
   */
  static readonly TeamCommunitiesAssignmentsAssignCommunitiesPath = '/api/team/communities';

  /**
   * Assign communities to the team, will ignore communities which were already associated with the team.
   * It will fail if a community is already assigned to another team,.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `teamCommunitiesAssignmentsAssignCommunities()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  teamCommunitiesAssignmentsAssignCommunities$Response(params: {

    /**
     * list of community ids
     */
    body: Array<string>
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, TeamCommunitiesAssignmentsService.TeamCommunitiesAssignmentsAssignCommunitiesPath, 'post');
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
   * Assign communities to the team, will ignore communities which were already associated with the team.
   * It will fail if a community is already assigned to another team,.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `teamCommunitiesAssignmentsAssignCommunities$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  teamCommunitiesAssignmentsAssignCommunities(params: {

    /**
     * list of community ids
     */
    body: Array<string>
  }): Observable<void> {

    return this.teamCommunitiesAssignmentsAssignCommunities$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation teamCommunitiesAssignmentsRemoveCommunities
   */
  static readonly TeamCommunitiesAssignmentsRemoveCommunitiesPath = '/api/team/communities';

  /**
   * Remove communities associations with the team, will ignore communities which are not associated.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `teamCommunitiesAssignmentsRemoveCommunities()` instead.
   *
   * This method doesn't expect any request body.
   */
  teamCommunitiesAssignmentsRemoveCommunities$Response(params?: {

    /**
     * list of community ids to disassociate
     */
    communityCodes?: Array<string>;
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, TeamCommunitiesAssignmentsService.TeamCommunitiesAssignmentsRemoveCommunitiesPath, 'delete');
    if (params) {
      rb.query('communityCodes', params.communityCodes, {"style":"form","explode":true});
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
   * Remove communities associations with the team, will ignore communities which are not associated.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `teamCommunitiesAssignmentsRemoveCommunities$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  teamCommunitiesAssignmentsRemoveCommunities(params?: {

    /**
     * list of community ids to disassociate
     */
    communityCodes?: Array<string>;
  }): Observable<void> {

    return this.teamCommunitiesAssignmentsRemoveCommunities$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

}
