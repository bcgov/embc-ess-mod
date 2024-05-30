/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { TeamMemberResult } from '../../models/team-member-result';

export interface TeamsDeleteTeamMember$Params {
  /**
   * team member id
   */
  memberId: string;
}

export function teamsDeleteTeamMember(
  http: HttpClient,
  rootUrl: string,
  params: TeamsDeleteTeamMember$Params,
  context?: HttpContext
): Observable<StrictHttpResponse<TeamMemberResult>> {
  const rb = new RequestBuilder(rootUrl, teamsDeleteTeamMember.PATH, 'delete');
  if (params) {
    rb.path('memberId', params.memberId, {});
  }

  return http.request(rb.build({ responseType: 'json', accept: 'application/json', context })).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<TeamMemberResult>;
    })
  );
}

teamsDeleteTeamMember.PATH = '/api/team/members/{memberId}';
