/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { SupplierListItem } from '../../models/supplier-list-item';

export interface SuppliersGetSuppliers$Params {
  /**
   * legalName
   */
  legalName?: string | null;

  /**
   * gstNumber
   */
  gstNumber?: string | null;
}

export function suppliersGetSuppliers(
  http: HttpClient,
  rootUrl: string,
  params?: SuppliersGetSuppliers$Params,
  context?: HttpContext
): Observable<StrictHttpResponse<Array<SupplierListItem>>> {
  const rb = new RequestBuilder(rootUrl, suppliersGetSuppliers.PATH, 'get');
  if (params) {
    rb.query('legalName', params.legalName, {});
    rb.query('gstNumber', params.gstNumber, {});
  }

  return http.request(rb.build({ responseType: 'json', accept: 'application/json', context })).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Array<SupplierListItem>>;
    })
  );
}

suppliersGetSuppliers.PATH = '/api/Suppliers';
