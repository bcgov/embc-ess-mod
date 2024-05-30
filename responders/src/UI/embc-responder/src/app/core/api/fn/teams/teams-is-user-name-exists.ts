/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

export interface TeamsIsUserNameExists$Params {
  userName?: string;
  memberId?: string | null;
}

export function teamsIsUserNameExists(
  http: HttpClient,
  rootUrl: string,
  params?: TeamsIsUserNameExists$Params,
  context?: HttpContext
): Observable<StrictHttpResponse<boolean>> {
  const rb = new RequestBuilder(rootUrl, teamsIsUserNameExists.PATH, 'get');
  if (params) {
    rb.query('userName', params.userName, {});
    rb.query('memberId', params.memberId, {});
  }

  return http.request(rb.build({ responseType: 'json', accept: 'application/json', context })).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return (r as HttpResponse<any>).clone({
        body: String((r as HttpResponse<any>).body) === 'true'
      }) as StrictHttpResponse<boolean>;
    })
  );
}

teamsIsUserNameExists.PATH = '/api/team/members/username';
