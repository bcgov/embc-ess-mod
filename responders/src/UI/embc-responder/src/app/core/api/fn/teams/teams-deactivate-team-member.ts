/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

export interface TeamsDeactivateTeamMember$Params {
  /**
   * team member id
   */
  memberId: string;
}

export function teamsDeactivateTeamMember(
  http: HttpClient,
  rootUrl: string,
  params: TeamsDeactivateTeamMember$Params,
  context?: HttpContext
): Observable<StrictHttpResponse<void>> {
  const rb = new RequestBuilder(rootUrl, teamsDeactivateTeamMember.PATH, 'post');
  if (params) {
    rb.path('memberId', params.memberId, {});
  }

  return http.request(rb.build({ responseType: 'text', accept: '*/*', context })).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
    })
  );
}

teamsDeactivateTeamMember.PATH = '/api/team/members/{memberId}/inactive';
