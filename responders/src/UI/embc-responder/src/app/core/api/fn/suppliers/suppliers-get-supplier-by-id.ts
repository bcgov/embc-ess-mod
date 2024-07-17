/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { Supplier } from '../../models/supplier';

export interface SuppliersGetSupplierById$Params {
  supplierId: string;
}

export function suppliersGetSupplierById(
  http: HttpClient,
  rootUrl: string,
  params: SuppliersGetSupplierById$Params,
  context?: HttpContext
): Observable<StrictHttpResponse<Supplier>> {
  const rb = new RequestBuilder(rootUrl, suppliersGetSupplierById.PATH, 'get');
  if (params) {
    rb.path('supplierId', params.supplierId, {});
  }

  return http.request(rb.build({ responseType: 'json', accept: 'application/json', context })).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Supplier>;
    })
  );
}

suppliersGetSupplierById.PATH = '/api/Suppliers/{supplierId}';
