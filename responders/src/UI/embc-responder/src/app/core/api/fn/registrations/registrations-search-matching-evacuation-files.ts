/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { EvacuationFileSearchResult } from '../../models/evacuation-file-search-result';

export interface RegistrationsSearchMatchingEvacuationFiles$Params {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  ManualFileId?: string;
}

export function registrationsSearchMatchingEvacuationFiles(
  http: HttpClient,
  rootUrl: string,
  params: RegistrationsSearchMatchingEvacuationFiles$Params,
  context?: HttpContext
): Observable<StrictHttpResponse<Array<EvacuationFileSearchResult>>> {
  const rb = new RequestBuilder(rootUrl, registrationsSearchMatchingEvacuationFiles.PATH, 'get');
  if (params) {
    rb.query('firstName', params.firstName, {});
    rb.query('lastName', params.lastName, {});
    rb.query('dateOfBirth', params.dateOfBirth, {});
    rb.query('ManualFileId', params.ManualFileId, {});
  }

  return http.request(rb.build({ responseType: 'json', accept: 'application/json', context })).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Array<EvacuationFileSearchResult>>;
    })
  );
}

registrationsSearchMatchingEvacuationFiles.PATH = '/api/Registrations/files/matches';
