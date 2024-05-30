/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { Note } from '../../models/note';
import { RegistrationResult } from '../../models/registration-result';

export interface RegistrationsUpdateFileNoteContent$Params {
  /**
   * fileId
   */
  fileId: string;

  /**
   * noteId
   */
  noteId: string;

  /**
   * note
   */
  body: Note;
}

export function registrationsUpdateFileNoteContent(
  http: HttpClient,
  rootUrl: string,
  params: RegistrationsUpdateFileNoteContent$Params,
  context?: HttpContext
): Observable<StrictHttpResponse<RegistrationResult>> {
  const rb = new RequestBuilder(rootUrl, registrationsUpdateFileNoteContent.PATH, 'post');
  if (params) {
    rb.path('fileId', params.fileId, {});
    rb.path('noteId', params.noteId, {});
    rb.body(params.body, 'application/json');
  }

  return http.request(rb.build({ responseType: 'json', accept: 'application/json', context })).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<RegistrationResult>;
    })
  );
}

registrationsUpdateFileNoteContent.PATH = '/api/Registrations/files/{fileId}/notes/{noteId}';
