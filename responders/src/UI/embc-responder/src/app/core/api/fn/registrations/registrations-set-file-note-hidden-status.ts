/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { RegistrationResult } from '../../models/registration-result';

export interface RegistrationsSetFileNoteHiddenStatus$Params {
  fileId: string;
  noteId: string;
  isHidden?: boolean;
}

export function registrationsSetFileNoteHiddenStatus(
  http: HttpClient,
  rootUrl: string,
  params: RegistrationsSetFileNoteHiddenStatus$Params,
  context?: HttpContext
): Observable<StrictHttpResponse<RegistrationResult>> {
  const rb = new RequestBuilder(rootUrl, registrationsSetFileNoteHiddenStatus.PATH, 'post');
  if (params) {
    rb.path('fileId', params.fileId, {});
    rb.path('noteId', params.noteId, {});
    rb.query('isHidden', params.isHidden, {});
  }

  return http.request(rb.build({ responseType: 'json', accept: 'application/json', context })).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<RegistrationResult>;
    })
  );
}

registrationsSetFileNoteHiddenStatus.PATH = '/api/Registrations/files/{fileId}/notes/{noteId}/hidden';
