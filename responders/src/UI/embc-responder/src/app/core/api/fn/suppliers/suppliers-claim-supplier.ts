/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { SupplierResult } from '../../models/supplier-result';

export interface SuppliersClaimSupplier$Params {
  /**
   * supplier id
   */
  supplierId: string;
}

export function suppliersClaimSupplier(
  http: HttpClient,
  rootUrl: string,
  params: SuppliersClaimSupplier$Params,
  context?: HttpContext
): Observable<StrictHttpResponse<SupplierResult>> {
  const rb = new RequestBuilder(rootUrl, suppliersClaimSupplier.PATH, 'post');
  if (params) {
    rb.path('supplierId', params.supplierId, {});
  }

  return http.request(rb.build({ responseType: 'json', accept: 'application/json', context })).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<SupplierResult>;
    })
  );
}

suppliersClaimSupplier.PATH = '/api/Suppliers/{supplierId}/claim';
