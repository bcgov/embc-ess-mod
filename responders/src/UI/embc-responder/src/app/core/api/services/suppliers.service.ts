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
   * Path part for operation suppliersCreateSupplier
   */
  static readonly SuppliersCreateSupplierPath = '/api/Suppliers';

  /**
   * Create Supplier.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `suppliersCreateSupplier()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  suppliersCreateSupplier$Response(params: {

    /**
     * supplier
     */
    body: Supplier
  }): Observable<StrictHttpResponse<SupplierResult>> {

    const rb = new RequestBuilder(this.rootUrl, SuppliersService.SuppliersCreateSupplierPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
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
   * Create Supplier.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `suppliersCreateSupplier$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  suppliersCreateSupplier(params: {

    /**
     * supplier
     */
    body: Supplier
  }): Observable<SupplierResult> {

    return this.suppliersCreateSupplier$Response(params).pipe(
      map((r: StrictHttpResponse<SupplierResult>) => r.body as SupplierResult)
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
   * Path part for operation suppliersUpdateSupplier
   */
  static readonly SuppliersUpdateSupplierPath = '/api/Suppliers/{supplierId}';

  /**
   * Update supplier.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `suppliersUpdateSupplier()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  suppliersUpdateSupplier$Response(params: {

    /**
     * supplier id
     */
    supplierId: string;

    /**
     * supplier
     */
    body: Supplier
  }): Observable<StrictHttpResponse<SupplierResult>> {

    const rb = new RequestBuilder(this.rootUrl, SuppliersService.SuppliersUpdateSupplierPath, 'post');
    if (params) {
      rb.path('supplierId', params.supplierId, {});
      rb.body(params.body, 'application/json');
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
   * Update supplier.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `suppliersUpdateSupplier$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  suppliersUpdateSupplier(params: {

    /**
     * supplier id
     */
    supplierId: string;

    /**
     * supplier
     */
    body: Supplier
  }): Observable<SupplierResult> {

    return this.suppliersUpdateSupplier$Response(params).pipe(
      map((r: StrictHttpResponse<SupplierResult>) => r.body as SupplierResult)
    );
  }

  /**
   * Path part for operation suppliersRemoveSupplier
   */
  static readonly SuppliersRemoveSupplierPath = '/api/Suppliers/{supplierId}/remove';

  /**
   * Remove supplier.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `suppliersRemoveSupplier()` instead.
   *
   * This method doesn't expect any request body.
   */
  suppliersRemoveSupplier$Response(params: {

    /**
     * supplier id
     */
    supplierId: string;
  }): Observable<StrictHttpResponse<SupplierResult>> {

    const rb = new RequestBuilder(this.rootUrl, SuppliersService.SuppliersRemoveSupplierPath, 'post');
    if (params) {
      rb.path('supplierId', params.supplierId, {});
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
   * Remove supplier.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `suppliersRemoveSupplier$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  suppliersRemoveSupplier(params: {

    /**
     * supplier id
     */
    supplierId: string;
  }): Observable<SupplierResult> {

    return this.suppliersRemoveSupplier$Response(params).pipe(
      map((r: StrictHttpResponse<SupplierResult>) => r.body as SupplierResult)
    );
  }

  /**
   * Path part for operation suppliersActivateSupplier
   */
  static readonly SuppliersActivateSupplierPath = '/api/Suppliers/{supplierId}/active';

  /**
   * Activate a supplier.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `suppliersActivateSupplier()` instead.
   *
   * This method doesn't expect any request body.
   */
  suppliersActivateSupplier$Response(params: {

    /**
     * supplier id
     */
    supplierId: string;
  }): Observable<StrictHttpResponse<SupplierResult>> {

    const rb = new RequestBuilder(this.rootUrl, SuppliersService.SuppliersActivateSupplierPath, 'post');
    if (params) {
      rb.path('supplierId', params.supplierId, {});
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
   * Activate a supplier.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `suppliersActivateSupplier$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  suppliersActivateSupplier(params: {

    /**
     * supplier id
     */
    supplierId: string;
  }): Observable<SupplierResult> {

    return this.suppliersActivateSupplier$Response(params).pipe(
      map((r: StrictHttpResponse<SupplierResult>) => r.body as SupplierResult)
    );
  }

  /**
   * Path part for operation suppliersDeactivateSupplier
   */
  static readonly SuppliersDeactivateSupplierPath = '/api/Suppliers/{supplierId}/inactive';

  /**
   * Activate a supplier.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `suppliersDeactivateSupplier()` instead.
   *
   * This method doesn't expect any request body.
   */
  suppliersDeactivateSupplier$Response(params: {

    /**
     * supplier id
     */
    supplierId: string;
  }): Observable<StrictHttpResponse<SupplierResult>> {

    const rb = new RequestBuilder(this.rootUrl, SuppliersService.SuppliersDeactivateSupplierPath, 'post');
    if (params) {
      rb.path('supplierId', params.supplierId, {});
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
   * Activate a supplier.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `suppliersDeactivateSupplier$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  suppliersDeactivateSupplier(params: {

    /**
     * supplier id
     */
    supplierId: string;
  }): Observable<SupplierResult> {

    return this.suppliersDeactivateSupplier$Response(params).pipe(
      map((r: StrictHttpResponse<SupplierResult>) => r.body as SupplierResult)
    );
  }

  /**
   * Path part for operation suppliersClaimSupplier
   */
  static readonly SuppliersClaimSupplierPath = '/api/Suppliers/{supplierId}/claim';

  /**
   * Claim a supplier.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `suppliersClaimSupplier()` instead.
   *
   * This method doesn't expect any request body.
   */
  suppliersClaimSupplier$Response(params: {

    /**
     * supplier id
     */
    supplierId: string;
  }): Observable<StrictHttpResponse<SupplierResult>> {

    const rb = new RequestBuilder(this.rootUrl, SuppliersService.SuppliersClaimSupplierPath, 'post');
    if (params) {
      rb.path('supplierId', params.supplierId, {});
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
   * Claim a supplier.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `suppliersClaimSupplier$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  suppliersClaimSupplier(params: {

    /**
     * supplier id
     */
    supplierId: string;
  }): Observable<SupplierResult> {

    return this.suppliersClaimSupplier$Response(params).pipe(
      map((r: StrictHttpResponse<SupplierResult>) => r.body as SupplierResult)
    );
  }

  /**
   * Path part for operation suppliersAddSupplierSharedWithTeam
   */
  static readonly SuppliersAddSupplierSharedWithTeamPath = '/api/Suppliers/{supplierId}/add-team/{sharedTeamId}';

  /**
   * Add a Team the Supplier is shared with.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `suppliersAddSupplierSharedWithTeam()` instead.
   *
   * This method doesn't expect any request body.
   */
  suppliersAddSupplierSharedWithTeam$Response(params: {

    /**
     * supplier id
     */
    supplierId: string;

    /**
     * shared team id
     */
    sharedTeamId: string;
  }): Observable<StrictHttpResponse<SupplierResult>> {

    const rb = new RequestBuilder(this.rootUrl, SuppliersService.SuppliersAddSupplierSharedWithTeamPath, 'post');
    if (params) {
      rb.path('supplierId', params.supplierId, {});
      rb.path('sharedTeamId', params.sharedTeamId, {});
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
   * Add a Team the Supplier is shared with.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `suppliersAddSupplierSharedWithTeam$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  suppliersAddSupplierSharedWithTeam(params: {

    /**
     * supplier id
     */
    supplierId: string;

    /**
     * shared team id
     */
    sharedTeamId: string;
  }): Observable<SupplierResult> {

    return this.suppliersAddSupplierSharedWithTeam$Response(params).pipe(
      map((r: StrictHttpResponse<SupplierResult>) => r.body as SupplierResult)
    );
  }

  /**
   * Path part for operation suppliersRemoveSupplierSharedWithTeam
   */
  static readonly SuppliersRemoveSupplierSharedWithTeamPath = '/api/Suppliers/{supplierId}/remove-team/{sharedTeamId}';

  /**
   * Remove a Team the Supplier is shared with.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `suppliersRemoveSupplierSharedWithTeam()` instead.
   *
   * This method doesn't expect any request body.
   */
  suppliersRemoveSupplierSharedWithTeam$Response(params: {

    /**
     * supplier id
     */
    supplierId: string;

    /**
     * shared team id
     */
    sharedTeamId: string;
  }): Observable<StrictHttpResponse<SupplierResult>> {

    const rb = new RequestBuilder(this.rootUrl, SuppliersService.SuppliersRemoveSupplierSharedWithTeamPath, 'post');
    if (params) {
      rb.path('supplierId', params.supplierId, {});
      rb.path('sharedTeamId', params.sharedTeamId, {});
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
   * Remove a Team the Supplier is shared with.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `suppliersRemoveSupplierSharedWithTeam$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  suppliersRemoveSupplierSharedWithTeam(params: {

    /**
     * supplier id
     */
    supplierId: string;

    /**
     * shared team id
     */
    sharedTeamId: string;
  }): Observable<SupplierResult> {

    return this.suppliersRemoveSupplierSharedWithTeam$Response(params).pipe(
      map((r: StrictHttpResponse<SupplierResult>) => r.body as SupplierResult)
    );
  }

}
