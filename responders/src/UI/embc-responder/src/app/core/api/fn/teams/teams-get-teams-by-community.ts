/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { Team } from '../../models/team';

export interface TeamsGetTeamsByCommunity$Params {
  /**
   * communityCode
   */
  communityCode: string;
}

export function teamsGetTeamsByCommunity(
  http: HttpClient,
  rootUrl: string,
  params: TeamsGetTeamsByCommunity$Params,
  context?: HttpContext
): Observable<StrictHttpResponse<Array<Team>>> {
  const rb = new RequestBuilder(rootUrl, teamsGetTeamsByCommunity.PATH, 'get');
  if (params) {
    rb.path('communityCode', params.communityCode, {});
  }

  return http.request(rb.build({ responseType: 'json', accept: 'application/json', context })).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Array<Team>>;
    })
  );
}

teamsGetTeamsByCommunity.PATH = '/api/team/community/{communityCode}';
