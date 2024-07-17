/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { ReferralPrintRequestResponse } from '../../models/referral-print-request-response';
import { SupportReprintReason } from '../../models/support-reprint-reason';

export interface RegistrationsReprintSupport$Params {
  fileId: string;
  supportId: string;
  reprintReason?: SupportReprintReason;
  includeSummary?: boolean;
}

export function registrationsReprintSupport(
  http: HttpClient,
  rootUrl: string,
  params: RegistrationsReprintSupport$Params,
  context?: HttpContext
): Observable<StrictHttpResponse<ReferralPrintRequestResponse>> {
  const rb = new RequestBuilder(rootUrl, registrationsReprintSupport.PATH, 'post');
  if (params) {
    rb.path('fileId', params.fileId, {});
    rb.path('supportId', params.supportId, {});
    rb.query('reprintReason', params.reprintReason, {});
    rb.query('includeSummary', params.includeSummary, {});
  }

  return http.request(rb.build({ responseType: 'json', accept: 'application/json', context })).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<ReferralPrintRequestResponse>;
    })
  );
}

registrationsReprintSupport.PATH = '/api/Registrations/files/{fileId}/supports/{supportId}/reprint';
