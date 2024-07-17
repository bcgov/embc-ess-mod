/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { TeamMember } from '../../models/team-member';
import { TeamMemberResult } from '../../models/team-member-result';

export interface TeamsUpdateTeamMember$Params {
  memberId: string;
  body?: TeamMember;
}

export function teamsUpdateTeamMember(
  http: HttpClient,
  rootUrl: string,
  params: TeamsUpdateTeamMember$Params,
  context?: HttpContext
): Observable<StrictHttpResponse<TeamMemberResult>> {
  const rb = new RequestBuilder(rootUrl, teamsUpdateTeamMember.PATH, 'post');
  if (params) {
    rb.path('memberId', params.memberId, {});
    rb.body(params.body, 'application/*+json');
  }

  return http.request(rb.build({ responseType: 'json', accept: 'application/json', context })).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<TeamMemberResult>;
    })
  );
}

teamsUpdateTeamMember.PATH = '/api/team/members/{memberId}';
