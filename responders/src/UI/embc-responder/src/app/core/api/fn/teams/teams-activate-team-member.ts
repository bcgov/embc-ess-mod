/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { TeamMemberResult } from '../../models/team-member-result';

export interface TeamsActivateTeamMember$Params {
  memberId: string;
}

export function teamsActivateTeamMember(
  http: HttpClient,
  rootUrl: string,
  params: TeamsActivateTeamMember$Params,
  context?: HttpContext
): Observable<StrictHttpResponse<TeamMemberResult>> {
  const rb = new RequestBuilder(rootUrl, teamsActivateTeamMember.PATH, 'post');
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

teamsActivateTeamMember.PATH = '/api/team/members/{memberId}/active';
