/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { UserProfile } from '../../models/user-profile';

export interface ProfileGetCurrentUserProfile$Params {}

export function profileGetCurrentUserProfile(
  http: HttpClient,
  rootUrl: string,
  params?: ProfileGetCurrentUserProfile$Params,
  context?: HttpContext
): Observable<StrictHttpResponse<UserProfile>> {
  const rb = new RequestBuilder(rootUrl, profileGetCurrentUserProfile.PATH, 'get');
  if (params) {
  }

  return http.request(rb.build({ responseType: 'json', accept: 'application/json', context })).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<UserProfile>;
    })
  );
}

profileGetCurrentUserProfile.PATH = '/api/Profile/current';
