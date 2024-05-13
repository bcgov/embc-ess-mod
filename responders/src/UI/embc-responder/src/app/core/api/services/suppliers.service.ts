/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { Supplier } from '../models/supplier';
import { SupplierListItem } from '../models/supplier-list-item';
import { SupplierResult } from '../models/supplier-result';
import { suppliersActivateSupplier } from '../fn/suppliers/suppliers-activate-supplier';
import { SuppliersActivateSupplier$Params } from '../fn/suppliers/suppliers-activate-supplier';
import { suppliersAddSupplierSharedWithTeam } from '../fn/suppliers/suppliers-add-supplier-shared-with-team';
import { SuppliersAddSupplierSharedWithTeam$Params } from '../fn/suppliers/suppliers-add-supplier-shared-with-team';
import { suppliersClaimSupplier } from '../fn/suppliers/suppliers-claim-supplier';
import { SuppliersClaimSupplier$Params } from '../fn/suppliers/suppliers-claim-supplier';
import { suppliersCreateSupplier } from '../fn/suppliers/suppliers-create-supplier';
import { SuppliersCreateSupplier$Params } from '../fn/suppliers/suppliers-create-supplier';
import { suppliersDeactivateSupplier } from '../fn/suppliers/suppliers-deactivate-supplier';
import { SuppliersDeactivateSupplier$Params } from '../fn/suppliers/suppliers-deactivate-supplier';
import { suppliersGetSupplierById } from '../fn/suppliers/suppliers-get-supplier-by-id';
import { SuppliersGetSupplierById$Params } from '../fn/suppliers/suppliers-get-supplier-by-id';
import { suppliersGetSuppliers } from '../fn/suppliers/suppliers-get-suppliers';
import { SuppliersGetSuppliers$Params } from '../fn/suppliers/suppliers-get-suppliers';
import { suppliersRemoveSupplier } from '../fn/suppliers/suppliers-remove-supplier';
import { SuppliersRemoveSupplier$Params } from '../fn/suppliers/suppliers-remove-supplier';
import { suppliersRemoveSupplierSharedWithTeam } from '../fn/suppliers/suppliers-remove-supplier-shared-with-team';
import { SuppliersRemoveSupplierSharedWithTeam$Params } from '../fn/suppliers/suppliers-remove-supplier-shared-with-team';
import { suppliersUpdateSupplier } from '../fn/suppliers/suppliers-update-supplier';
import { SuppliersUpdateSupplier$Params } from '../fn/suppliers/suppliers-update-supplier';

@Injectable({ providedIn: 'root' })
export class SuppliersService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `suppliersGetSuppliers()` */
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
  suppliersGetSuppliers$Response(
    params?: SuppliersGetSuppliers$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<Array<SupplierListItem>>> {
    return suppliersGetSuppliers(this.http, this.rootUrl, params, context);
  }

  /**
   * Search Suppliers.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `suppliersGetSuppliers$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  suppliersGetSuppliers(
    params?: SuppliersGetSuppliers$Params,
    context?: HttpContext
  ): Observable<Array<SupplierListItem>> {
    return this.suppliersGetSuppliers$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<SupplierListItem>>): Array<SupplierListItem> => r.body)
    );
  }

  /** Path part for operation `suppliersCreateSupplier()` */
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
  suppliersCreateSupplier$Response(
    params: SuppliersCreateSupplier$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<SupplierResult>> {
    return suppliersCreateSupplier(this.http, this.rootUrl, params, context);
  }

  /**
   * Create Supplier.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `suppliersCreateSupplier$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  suppliersCreateSupplier(params: SuppliersCreateSupplier$Params, context?: HttpContext): Observable<SupplierResult> {
    return this.suppliersCreateSupplier$Response(params, context).pipe(
      map((r: StrictHttpResponse<SupplierResult>): SupplierResult => r.body)
    );
  }

  /** Path part for operation `suppliersGetSupplierById()` */
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
  suppliersGetSupplierById$Response(
    params: SuppliersGetSupplierById$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<Supplier>> {
    return suppliersGetSupplierById(this.http, this.rootUrl, params, context);
  }

  /**
   * Get Supplier by id.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `suppliersGetSupplierById$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  suppliersGetSupplierById(params: SuppliersGetSupplierById$Params, context?: HttpContext): Observable<Supplier> {
    return this.suppliersGetSupplierById$Response(params, context).pipe(
      map((r: StrictHttpResponse<Supplier>): Supplier => r.body)
    );
  }

  /** Path part for operation `suppliersUpdateSupplier()` */
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
  suppliersUpdateSupplier$Response(
    params: SuppliersUpdateSupplier$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<SupplierResult>> {
    return suppliersUpdateSupplier(this.http, this.rootUrl, params, context);
  }

  /**
   * Update supplier.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `suppliersUpdateSupplier$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  suppliersUpdateSupplier(params: SuppliersUpdateSupplier$Params, context?: HttpContext): Observable<SupplierResult> {
    return this.suppliersUpdateSupplier$Response(params, context).pipe(
      map((r: StrictHttpResponse<SupplierResult>): SupplierResult => r.body)
    );
  }

  /** Path part for operation `suppliersRemoveSupplier()` */
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
  suppliersRemoveSupplier$Response(
    params: SuppliersRemoveSupplier$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<SupplierResult>> {
    return suppliersRemoveSupplier(this.http, this.rootUrl, params, context);
  }

  /**
   * Remove supplier.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `suppliersRemoveSupplier$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  suppliersRemoveSupplier(params: SuppliersRemoveSupplier$Params, context?: HttpContext): Observable<SupplierResult> {
    return this.suppliersRemoveSupplier$Response(params, context).pipe(
      map((r: StrictHttpResponse<SupplierResult>): SupplierResult => r.body)
    );
  }

  /** Path part for operation `suppliersActivateSupplier()` */
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
  suppliersActivateSupplier$Response(
    params: SuppliersActivateSupplier$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<SupplierResult>> {
    return suppliersActivateSupplier(this.http, this.rootUrl, params, context);
  }

  /**
   * Activate a supplier.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `suppliersActivateSupplier$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  suppliersActivateSupplier(
    params: SuppliersActivateSupplier$Params,
    context?: HttpContext
  ): Observable<SupplierResult> {
    return this.suppliersActivateSupplier$Response(params, context).pipe(
      map((r: StrictHttpResponse<SupplierResult>): SupplierResult => r.body)
    );
  }

  /** Path part for operation `suppliersDeactivateSupplier()` */
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
  suppliersDeactivateSupplier$Response(
    params: SuppliersDeactivateSupplier$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<SupplierResult>> {
    return suppliersDeactivateSupplier(this.http, this.rootUrl, params, context);
  }

  /**
   * Activate a supplier.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `suppliersDeactivateSupplier$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  suppliersDeactivateSupplier(
    params: SuppliersDeactivateSupplier$Params,
    context?: HttpContext
  ): Observable<SupplierResult> {
    return this.suppliersDeactivateSupplier$Response(params, context).pipe(
      map((r: StrictHttpResponse<SupplierResult>): SupplierResult => r.body)
    );
  }

  /** Path part for operation `suppliersClaimSupplier()` */
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
  suppliersClaimSupplier$Response(
    params: SuppliersClaimSupplier$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<SupplierResult>> {
    return suppliersClaimSupplier(this.http, this.rootUrl, params, context);
  }

  /**
   * Claim a supplier.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `suppliersClaimSupplier$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  suppliersClaimSupplier(params: SuppliersClaimSupplier$Params, context?: HttpContext): Observable<SupplierResult> {
    return this.suppliersClaimSupplier$Response(params, context).pipe(
      map((r: StrictHttpResponse<SupplierResult>): SupplierResult => r.body)
    );
  }

  /** Path part for operation `suppliersAddSupplierSharedWithTeam()` */
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
  suppliersAddSupplierSharedWithTeam$Response(
    params: SuppliersAddSupplierSharedWithTeam$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<SupplierResult>> {
    return suppliersAddSupplierSharedWithTeam(this.http, this.rootUrl, params, context);
  }

  /**
   * Add a Team the Supplier is shared with.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `suppliersAddSupplierSharedWithTeam$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  suppliersAddSupplierSharedWithTeam(
    params: SuppliersAddSupplierSharedWithTeam$Params,
    context?: HttpContext
  ): Observable<SupplierResult> {
    return this.suppliersAddSupplierSharedWithTeam$Response(params, context).pipe(
      map((r: StrictHttpResponse<SupplierResult>): SupplierResult => r.body)
    );
  }

  /** Path part for operation `suppliersRemoveSupplierSharedWithTeam()` */
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
  suppliersRemoveSupplierSharedWithTeam$Response(
    params: SuppliersRemoveSupplierSharedWithTeam$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<SupplierResult>> {
    return suppliersRemoveSupplierSharedWithTeam(this.http, this.rootUrl, params, context);
  }

  /**
   * Remove a Team the Supplier is shared with.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `suppliersRemoveSupplierSharedWithTeam$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  suppliersRemoveSupplierSharedWithTeam(
    params: SuppliersRemoveSupplierSharedWithTeam$Params,
    context?: HttpContext
  ): Observable<SupplierResult> {
    return this.suppliersRemoveSupplierSharedWithTeam$Response(params, context).pipe(
      map((r: StrictHttpResponse<SupplierResult>): SupplierResult => r.body)
    );
  }
}
