/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { SupplierResult } from '../../models/supplier-result';

export interface SuppliersRemoveSupplierSharedWithTeam$Params {
  supplierId: string;
  sharedTeamId: string;
}

export function suppliersRemoveSupplierSharedWithTeam(
  http: HttpClient,
  rootUrl: string,
  params: SuppliersRemoveSupplierSharedWithTeam$Params,
  context?: HttpContext
): Observable<StrictHttpResponse<SupplierResult>> {
  const rb = new RequestBuilder(rootUrl, suppliersRemoveSupplierSharedWithTeam.PATH, 'post');
  if (params) {
    rb.path('supplierId', params.supplierId, {});
    rb.path('sharedTeamId', params.sharedTeamId, {});
  }

  return http.request(rb.build({ responseType: 'json', accept: 'application/json', context })).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<SupplierResult>;
    })
  );
}

suppliersRemoveSupplierSharedWithTeam.PATH = '/api/Suppliers/{supplierId}/remove-team/{sharedTeamId}';
