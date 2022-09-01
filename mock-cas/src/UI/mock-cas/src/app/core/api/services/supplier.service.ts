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

import { GetSupplierResponse } from '../models/get-supplier-response';

@Injectable({
  providedIn: 'root',
})
export class SupplierService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation supplierGet
   */
  static readonly SupplierGetPath = '/api/Supplier';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `supplierGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  supplierGet$Response(params?: {
  }): Observable<StrictHttpResponse<Array<GetSupplierResponse>>> {

    const rb = new RequestBuilder(this.rootUrl, SupplierService.SupplierGetPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<GetSupplierResponse>>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `supplierGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  supplierGet(params?: {
  }): Observable<Array<GetSupplierResponse>> {

    return this.supplierGet$Response(params).pipe(
      map((r: StrictHttpResponse<Array<GetSupplierResponse>>) => r.body as Array<GetSupplierResponse>)
    );
  }

  /**
   * Path part for operation supplierDeleteSupplierByName
   */
  static readonly SupplierDeleteSupplierByNamePath = '/api/Supplier/{supplierName}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `supplierDeleteSupplierByName()` instead.
   *
   * This method doesn't expect any request body.
   */
  supplierDeleteSupplierByName$Response(params: {
    supplierName: string;
  }): Observable<StrictHttpResponse<number>> {

    const rb = new RequestBuilder(this.rootUrl, SupplierService.SupplierDeleteSupplierByNamePath, 'delete');
    if (params) {
      rb.path('supplierName', params.supplierName, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: parseFloat(String((r as HttpResponse<any>).body)) }) as StrictHttpResponse<number>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `supplierDeleteSupplierByName$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  supplierDeleteSupplierByName(params: {
    supplierName: string;
  }): Observable<number> {

    return this.supplierDeleteSupplierByName$Response(params).pipe(
      map((r: StrictHttpResponse<number>) => r.body as number)
    );
  }

}
