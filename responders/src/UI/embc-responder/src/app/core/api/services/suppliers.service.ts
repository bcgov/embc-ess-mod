/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';
import { RequestBuilder } from '../request-builder';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { Supplier } from '../models/supplier';
import { SupplierResult } from '../models/supplier-result';

@Injectable({
  providedIn: 'root',
})
export class SuppliersService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation suppliersGetSuppliers
   */
  static readonly SuppliersGetSuppliersPath = '/api/Suppliers';

  /**
   * Search Suppliers.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `suppliersGetSuppliers()` instead.
   *
   * This method doesn't expect any request body.
   */
  suppliersGetSuppliers$Response(params?: {
  }): Observable<StrictHttpResponse<Array<Supplier>>> {

    const rb = new RequestBuilder(this.rootUrl, SuppliersService.SuppliersGetSuppliersPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<Supplier>>;
      })
    );
  }

  /**
   * Search Suppliers.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `suppliersGetSuppliers$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  suppliersGetSuppliers(params?: {
  }): Observable<Array<Supplier>> {

    return this.suppliersGetSuppliers$Response(params).pipe(
      map((r: StrictHttpResponse<Array<Supplier>>) => r.body as Array<Supplier>)
    );
  }

  /**
   * Path part for operation suppliersSetSupplierStatus
   */
  static readonly SuppliersSetSupplierStatusPath = '/api/Suppliers/{supplierId}/status/{status}';

  /**
   * Update Supplier Status.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `suppliersSetSupplierStatus()` instead.
   *
   * This method doesn't expect any request body.
   */
  suppliersSetSupplierStatus$Response(params: {

    /**
     * SupplierId
     */
    supplierId: string;

    /**
     * Status
     */
    status: boolean;
  }): Observable<StrictHttpResponse<SupplierResult>> {

    const rb = new RequestBuilder(this.rootUrl, SuppliersService.SuppliersSetSupplierStatusPath, 'post');
    if (params) {
      rb.path('supplierId', params.supplierId, {});
      rb.path('status', params.status, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<SupplierResult>;
      })
    );
  }

  /**
   * Update Supplier Status.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `suppliersSetSupplierStatus$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  suppliersSetSupplierStatus(params: {

    /**
     * SupplierId
     */
    supplierId: string;

    /**
     * Status
     */
    status: boolean;
  }): Observable<SupplierResult> {

    return this.suppliersSetSupplierStatus$Response(params).pipe(
      map((r: StrictHttpResponse<SupplierResult>) => r.body as SupplierResult)
    );
  }

}
