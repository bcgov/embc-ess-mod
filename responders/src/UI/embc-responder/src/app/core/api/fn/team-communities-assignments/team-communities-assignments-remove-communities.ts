/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

export interface TeamCommunitiesAssignmentsRemoveCommunities$Params {
  /**
   * list of community ids to disassociate
   */
  communityCodes?: Array<string>;
}

export function teamCommunitiesAssignmentsRemoveCommunities(
  http: HttpClient,
  rootUrl: string,
  params?: TeamCommunitiesAssignmentsRemoveCommunities$Params,
  context?: HttpContext
): Observable<StrictHttpResponse<void>> {
  const rb = new RequestBuilder(rootUrl, teamCommunitiesAssignmentsRemoveCommunities.PATH, 'delete');
  if (params) {
    rb.query('communityCodes', params.communityCodes, { style: 'form', explode: true });
  }

  return http.request(rb.build({ responseType: 'text', accept: '*/*', context })).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
    })
  );
}

teamCommunitiesAssignmentsRemoveCommunities.PATH = '/api/team/communities';
