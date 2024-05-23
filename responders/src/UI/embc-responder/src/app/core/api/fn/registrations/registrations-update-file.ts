/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { EvacuationFile } from '../../models/evacuation-file';
import { RegistrationResult } from '../../models/registration-result';

export interface RegistrationsUpdateFile$Params {
  /**
   * fileId
   */
  fileId: string;

  /**
   * file
   */
  body: EvacuationFile;
}

export function registrationsUpdateFile(
  http: HttpClient,
  rootUrl: string,
  params: RegistrationsUpdateFile$Params,
  context?: HttpContext
): Observable<StrictHttpResponse<RegistrationResult>> {
  const rb = new RequestBuilder(rootUrl, registrationsUpdateFile.PATH, 'post');
  if (params) {
    rb.path('fileId', params.fileId, {});
    rb.body(params.body, 'application/json');
  }

  return http.request(rb.build({ responseType: 'json', accept: 'application/json', context })).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<RegistrationResult>;
    })
  );
}

registrationsUpdateFile.PATH = '/api/Registrations/files/{fileId}';
