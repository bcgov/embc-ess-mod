/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { EvacuationFileSummary } from '../../models/evacuation-file-summary';

export interface RegistrationsGetFiles$Params {
  /**
   * fileId
   */
  registrantId?: string | null;

  /**
   * manualFileId
   */
  manualFileId?: string | null;

  /**
   * id
   */
  id?: string | null;
}

export function registrationsGetFiles(
  http: HttpClient,
  rootUrl: string,
  params?: RegistrationsGetFiles$Params,
  context?: HttpContext
): Observable<StrictHttpResponse<Array<EvacuationFileSummary>>> {
  const rb = new RequestBuilder(rootUrl, registrationsGetFiles.PATH, 'get');
  if (params) {
    rb.query('registrantId', params.registrantId, {});
    rb.query('manualFileId', params.manualFileId, {});
    rb.query('id', params.id, {});
  }

  return http.request(rb.build({ responseType: 'json', accept: 'application/json', context })).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Array<EvacuationFileSummary>>;
    })
  );
}

registrationsGetFiles.PATH = '/api/Registrations/files';
