/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { Support } from '../../models/support';

export interface RegistrationsSearchSupports$Params {
  /**
   * search for supports for an manual referral id
   */
  manualReferralId?: string | null;

  /**
   * search for supports in a specific evacuation file
   */
  fileId?: string | null;
}

export function registrationsSearchSupports(
  http: HttpClient,
  rootUrl: string,
  params?: RegistrationsSearchSupports$Params,
  context?: HttpContext
): Observable<StrictHttpResponse<Array<Support>>> {
  const rb = new RequestBuilder(rootUrl, registrationsSearchSupports.PATH, 'get');
  if (params) {
    rb.query('manualReferralId', params.manualReferralId, {});
    rb.query('fileId', params.fileId, {});
  }

  return http.request(rb.build({ responseType: 'json', accept: 'application/json', context })).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Array<Support>>;
    })
  );
}

registrationsSearchSupports.PATH = '/api/Registrations/supports';
