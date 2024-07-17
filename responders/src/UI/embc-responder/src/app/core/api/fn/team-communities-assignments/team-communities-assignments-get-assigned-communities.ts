/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { AssignedCommunity } from '../../models/assigned-community';

export interface TeamCommunitiesAssignmentsGetAssignedCommunities$Params {
  forAllTeams?: boolean;
}

export function teamCommunitiesAssignmentsGetAssignedCommunities(
  http: HttpClient,
  rootUrl: string,
  params?: TeamCommunitiesAssignmentsGetAssignedCommunities$Params,
  context?: HttpContext
): Observable<StrictHttpResponse<Array<AssignedCommunity>>> {
  const rb = new RequestBuilder(rootUrl, teamCommunitiesAssignmentsGetAssignedCommunities.PATH, 'get');
  if (params) {
    rb.query('forAllTeams', params.forAllTeams, {});
  }

  return http.request(rb.build({ responseType: 'json', accept: 'application/json', context })).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Array<AssignedCommunity>>;
    })
  );
}

teamCommunitiesAssignmentsGetAssignedCommunities.PATH = '/api/team/communities';
