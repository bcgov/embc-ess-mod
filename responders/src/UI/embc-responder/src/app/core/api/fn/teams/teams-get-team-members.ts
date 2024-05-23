/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { TeamMember } from '../../models/team-member';

export interface TeamsGetTeamMembers$Params {}

export function teamsGetTeamMembers(
  http: HttpClient,
  rootUrl: string,
  params?: TeamsGetTeamMembers$Params,
  context?: HttpContext
): Observable<StrictHttpResponse<Array<TeamMember>>> {
  const rb = new RequestBuilder(rootUrl, teamsGetTeamMembers.PATH, 'get');
  if (params) {
  }

  return http.request(rb.build({ responseType: 'json', accept: 'application/json', context })).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Array<TeamMember>>;
    })
  );
}

teamsGetTeamMembers.PATH = '/api/team/members';
