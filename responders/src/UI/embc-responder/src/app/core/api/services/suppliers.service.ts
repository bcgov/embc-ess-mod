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
import { SupplierListItem } from '../models/supplier-list-item';
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

    /**
     * legalName
     */
    legalName?: string;

    /**
     * gstNumber
     */
    gstNumber?: string;
  }): Observable<StrictHttpResponse<Array<SupplierListItem>>> {

    const rb = new RequestBuilder(this.rootUrl, SuppliersService.SuppliersGetSuppliersPath, 'get');
    if (params) {
      rb.query('legalName', params.legalName, {});
      rb.query('gstNumber', params.gstNumber, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<SupplierListItem>>;
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

    /**
     * legalName
     */
    legalName?: string;

    /**
     * gstNumber
     */
    gstNumber?: string;
  }): Observable<Array<SupplierListItem>> {

    return this.suppliersGetSuppliers$Response(params).pipe(
      map((r: StrictHttpResponse<Array<SupplierListItem>>) => r.body as Array<SupplierListItem>)
    );
  }

  /**
   * Path part for operation suppliersGetSupplierById
   */
  static readonly SuppliersGetSupplierByIdPath = '/api/Suppliers/{supplierId}';

  /**
   * Get Supplier by id.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `suppliersGetSupplierById()` instead.
   *
   * This method doesn't expect any request body.
   */
  suppliersGetSupplierById$Response(params: {

    /**
     * SupplierId
     */
    supplierId: string;
  }): Observable<StrictHttpResponse<Supplier>> {

    const rb = new RequestBuilder(this.rootUrl, SuppliersService.SuppliersGetSupplierByIdPath, 'get');
    if (params) {
      rb.path('supplierId', params.supplierId, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Supplier>;
      })
    );
  }

  /**
   * Get Supplier by id.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `suppliersGetSupplierById$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  suppliersGetSupplierById(params: {

    /**
     * SupplierId
     */
    supplierId: string;
  }): Observable<Supplier> {

    return this.suppliersGetSupplierById$Response(params).pipe(
      map((r: StrictHttpResponse<Supplier>) => r.body as Supplier)
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
