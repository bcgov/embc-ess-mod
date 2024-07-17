/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { TeamMember } from '../../models/team-member';

export interface TeamsGetTeamMember$Params {
  memberId: string;
}

export function teamsGetTeamMember(
  http: HttpClient,
  rootUrl: string,
  params: TeamsGetTeamMember$Params,
  context?: HttpContext
): Observable<StrictHttpResponse<TeamMember>> {
  const rb = new RequestBuilder(rootUrl, teamsGetTeamMember.PATH, 'get');
  if (params) {
    rb.path('memberId', params.memberId, {});
  }

  return http.request(rb.build({ responseType: 'json', accept: 'application/json', context })).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<TeamMember>;
    })
  );
}

teamsGetTeamMember.PATH = '/api/team/members/{memberId}';
