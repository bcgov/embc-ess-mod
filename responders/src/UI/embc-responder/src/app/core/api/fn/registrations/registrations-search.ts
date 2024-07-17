/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { SearchResults } from '../../models/search-results';

export interface RegistrationsSearch$Params {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  ManualFileId?: string;
}

export function registrationsSearch(
  http: HttpClient,
  rootUrl: string,
  params: RegistrationsSearch$Params,
  context?: HttpContext
): Observable<StrictHttpResponse<SearchResults>> {
  const rb = new RequestBuilder(rootUrl, registrationsSearch.PATH, 'get');
  if (params) {
    rb.query('firstName', params.firstName, {});
    rb.query('lastName', params.lastName, {});
    rb.query('dateOfBirth', params.dateOfBirth, {});
    rb.query('ManualFileId', params.ManualFileId, {});
  }

  return http.request(rb.build({ responseType: 'json', accept: 'application/json', context })).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<SearchResults>;
    })
  );
}

registrationsSearch.PATH = '/api/Registrations';
