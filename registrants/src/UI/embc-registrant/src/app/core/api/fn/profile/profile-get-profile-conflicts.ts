/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { AddressDataConflict } from '../../models/address-data-conflict';
import { DateOfBirthDataConflict } from '../../models/date-of-birth-data-conflict';
import { NameDataConflict } from '../../models/name-data-conflict';

export interface ProfileGetProfileConflicts$Params {}

export function profileGetProfileConflicts(
  http: HttpClient,
  rootUrl: string,
  params?: ProfileGetProfileConflicts$Params,
  context?: HttpContext
): Observable<StrictHttpResponse<Array<DateOfBirthDataConflict | NameDataConflict | AddressDataConflict>>> {
  const rb = new RequestBuilder(rootUrl, profileGetProfileConflicts.PATH, 'get');
  if (params) {
  }

  return http.request(rb.build({ responseType: 'json', accept: 'application/json', context })).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Array<DateOfBirthDataConflict | NameDataConflict | AddressDataConflict>>;
    })
  );
}

profileGetProfileConflicts.PATH = '/api/profiles/current/conflicts';
