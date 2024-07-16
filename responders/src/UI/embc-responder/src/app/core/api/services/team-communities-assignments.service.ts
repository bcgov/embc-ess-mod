/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { AssignedCommunity } from '../models/assigned-community';
import { teamCommunitiesAssignmentsAssignCommunities } from '../fn/team-communities-assignments/team-communities-assignments-assign-communities';
import { TeamCommunitiesAssignmentsAssignCommunities$Params } from '../fn/team-communities-assignments/team-communities-assignments-assign-communities';
import { teamCommunitiesAssignmentsGetAssignedCommunities } from '../fn/team-communities-assignments/team-communities-assignments-get-assigned-communities';
import { TeamCommunitiesAssignmentsGetAssignedCommunities$Params } from '../fn/team-communities-assignments/team-communities-assignments-get-assigned-communities';
import { teamCommunitiesAssignmentsRemoveCommunities } from '../fn/team-communities-assignments/team-communities-assignments-remove-communities';
import { TeamCommunitiesAssignmentsRemoveCommunities$Params } from '../fn/team-communities-assignments/team-communities-assignments-remove-communities';

@Injectable({ providedIn: 'root' })
export class TeamCommunitiesAssignmentsService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `teamCommunitiesAssignmentsGetAssignedCommunities()` */
  static readonly TeamCommunitiesAssignmentsGetAssignedCommunitiesPath = '/api/team/communities';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `teamCommunitiesAssignmentsGetAssignedCommunities()` instead.
   *
   * This method doesn't expect any request body.
   */
  teamCommunitiesAssignmentsGetAssignedCommunities$Response(
    params?: TeamCommunitiesAssignmentsGetAssignedCommunities$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<Array<AssignedCommunity>>> {
    return teamCommunitiesAssignmentsGetAssignedCommunities(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `teamCommunitiesAssignmentsGetAssignedCommunities$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  teamCommunitiesAssignmentsGetAssignedCommunities(
    params?: TeamCommunitiesAssignmentsGetAssignedCommunities$Params,
    context?: HttpContext
  ): Observable<Array<AssignedCommunity>> {
    return this.teamCommunitiesAssignmentsGetAssignedCommunities$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<AssignedCommunity>>): Array<AssignedCommunity> => r.body)
    );
  }

  /** Path part for operation `teamCommunitiesAssignmentsAssignCommunities()` */
  static readonly TeamCommunitiesAssignmentsAssignCommunitiesPath = '/api/team/communities';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `teamCommunitiesAssignmentsAssignCommunities()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  teamCommunitiesAssignmentsAssignCommunities$Response(
    params?: TeamCommunitiesAssignmentsAssignCommunities$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<void>> {
    return teamCommunitiesAssignmentsAssignCommunities(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `teamCommunitiesAssignmentsAssignCommunities$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  teamCommunitiesAssignmentsAssignCommunities(
    params?: TeamCommunitiesAssignmentsAssignCommunities$Params,
    context?: HttpContext
  ): Observable<void> {
    return this.teamCommunitiesAssignmentsAssignCommunities$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

  /** Path part for operation `teamCommunitiesAssignmentsRemoveCommunities()` */
  static readonly TeamCommunitiesAssignmentsRemoveCommunitiesPath = '/api/team/communities';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `teamCommunitiesAssignmentsRemoveCommunities()` instead.
   *
   * This method doesn't expect any request body.
   */
  teamCommunitiesAssignmentsRemoveCommunities$Response(
    params?: TeamCommunitiesAssignmentsRemoveCommunities$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<void>> {
    return teamCommunitiesAssignmentsRemoveCommunities(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `teamCommunitiesAssignmentsRemoveCommunities$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  teamCommunitiesAssignmentsRemoveCommunities(
    params?: TeamCommunitiesAssignmentsRemoveCommunities$Params,
    context?: HttpContext
  ): Observable<void> {
    return this.teamCommunitiesAssignmentsRemoveCommunities$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }
}
