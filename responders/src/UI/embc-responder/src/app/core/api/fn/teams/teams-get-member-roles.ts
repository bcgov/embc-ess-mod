/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { MemberRoleDescription } from '../../models/member-role-description';

export interface TeamsGetMemberRoles$Params {}

export function teamsGetMemberRoles(
  http: HttpClient,
  rootUrl: string,
  params?: TeamsGetMemberRoles$Params,
  context?: HttpContext
): Observable<StrictHttpResponse<Array<MemberRoleDescription>>> {
  const rb = new RequestBuilder(rootUrl, teamsGetMemberRoles.PATH, 'get');
  if (params) {
  }

  return http.request(rb.build({ responseType: 'json', accept: 'application/json', context })).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Array<MemberRoleDescription>>;
    })
  );
}

teamsGetMemberRoles.PATH = '/api/team/members/codes/memberrole';
