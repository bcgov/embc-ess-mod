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
import { SupplierSearchResult } from '../models/supplier-search-result';

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
   * Path part for operation suppliersSearchSupppliers
   */
  static readonly SuppliersSearchSupppliersPath = '/api/Suppliers';

  /**
   * Search Suppliers.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `suppliersSearchSupppliers()` instead.
   *
   * This method doesn't expect any request body.
   */
  suppliersSearchSupppliers$Response(params?: {

    /**
     * name
     */
    name?: string;
  }): Observable<StrictHttpResponse<Array<SupplierSearchResult>>> {

    const rb = new RequestBuilder(this.rootUrl, SuppliersService.SuppliersSearchSupppliersPath, 'get');
    if (params) {
      rb.query('name', params.name, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<SupplierSearchResult>>;
      })
    );
  }

  /**
   * Search Suppliers.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `suppliersSearchSupppliers$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  suppliersSearchSupppliers(params?: {

    /**
     * name
     */
    name?: string;
  }): Observable<Array<SupplierSearchResult>> {

    return this.suppliersSearchSupppliers$Response(params).pipe(
      map((r: StrictHttpResponse<Array<SupplierSearchResult>>) => r.body as Array<SupplierSearchResult>)
    );
  }

  /**
   * Path part for operation suppliersGetSupplierById
   */
  static readonly SuppliersGetSupplierByIdPath = '/api/Suppliers/{suppplierId}';

  /**
   * Get supplier by id.
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
     * suppplierId
     */
    suppplierId: string;
  }): Observable<StrictHttpResponse<Supplier>> {

    const rb = new RequestBuilder(this.rootUrl, SuppliersService.SuppliersGetSupplierByIdPath, 'get');
    if (params) {
      rb.path('suppplierId', params.suppplierId, {});
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
   * Get supplier by id.
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
     * suppplierId
     */
    suppplierId: string;
  }): Observable<Supplier> {

    return this.suppliersGetSupplierById$Response(params).pipe(
      map((r: StrictHttpResponse<Supplier>) => r.body as Supplier)
    );
  }

  /**
   * Path part for operation suppliersSetSupplierStatus
   */
  static readonly SuppliersSetSupplierStatusPath = '/api/Suppliers/{suppplierId}/status/{status}';

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
     * SuppplierId
     */
    suppplierId: string;

    /**
     * Status
     */
    status: boolean;
  }): Observable<StrictHttpResponse<SupplierResult>> {

    const rb = new RequestBuilder(this.rootUrl, SuppliersService.SuppliersSetSupplierStatusPath, 'post');
    if (params) {
      rb.path('suppplierId', params.suppplierId, {});
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
     * SuppplierId
     */
    suppplierId: string;

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
