/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { EvacuationFile } from '../../models/evacuation-file';

export interface RegistrationsGetFile$Params {
  fileId: string;
  needsAssessmentId?: string;
}

export function registrationsGetFile(
  http: HttpClient,
  rootUrl: string,
  params: RegistrationsGetFile$Params,
  context?: HttpContext
): Observable<StrictHttpResponse<EvacuationFile>> {
  const rb = new RequestBuilder(rootUrl, registrationsGetFile.PATH, 'get');
  if (params) {
    rb.path('fileId', params.fileId, {});
    rb.query('needsAssessmentId', params.needsAssessmentId, {});
  }

  return http.request(rb.build({ responseType: 'json', accept: 'application/json', context })).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<EvacuationFile>;
    })
  );
}

registrationsGetFile.PATH = '/api/Registrations/files/{fileId}';
