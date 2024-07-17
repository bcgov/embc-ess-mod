/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { Supplier } from '../../models/supplier';
import { SupplierResult } from '../../models/supplier-result';

export interface SuppliersUpdateSupplier$Params {
  supplierId: string;
  body?: Supplier;
}

export function suppliersUpdateSupplier(
  http: HttpClient,
  rootUrl: string,
  params: SuppliersUpdateSupplier$Params,
  context?: HttpContext
): Observable<StrictHttpResponse<SupplierResult>> {
  const rb = new RequestBuilder(rootUrl, suppliersUpdateSupplier.PATH, 'post');
  if (params) {
    rb.path('supplierId', params.supplierId, {});
    rb.body(params.body, 'application/*+json');
  }

  return http.request(rb.build({ responseType: 'json', accept: 'application/json', context })).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<SupplierResult>;
    })
  );
}

suppliersUpdateSupplier.PATH = '/api/Suppliers/{supplierId}';
