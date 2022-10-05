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

import { CreateSupplierRequest } from '../models/create-supplier-request';
import { CreateSupplierResponse } from '../models/create-supplier-response';
import { GetInvoiceResponse } from '../models/get-invoice-response';
import { GetSupplierResponse } from '../models/get-supplier-response';
import { Invoice } from '../models/invoice';
import { InvoiceResponse } from '../models/invoice-response';

@Injectable({
  providedIn: 'root',
})
export class MockCasService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation mockCasCreateInvoice
   */
  static readonly MockCasCreateInvoicePath = '/api/MockCas/cfs/apinvoice';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `mockCasCreateInvoice()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  mockCasCreateInvoice$Response(params: {
    body: Invoice
  }): Observable<StrictHttpResponse<InvoiceResponse>> {

    const rb = new RequestBuilder(this.rootUrl, MockCasService.MockCasCreateInvoicePath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<InvoiceResponse>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `mockCasCreateInvoice$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  mockCasCreateInvoice(params: {
    body: Invoice
  }): Observable<InvoiceResponse> {

    return this.mockCasCreateInvoice$Response(params).pipe(
      map((r: StrictHttpResponse<InvoiceResponse>) => r.body as InvoiceResponse)
    );
  }

  /**
   * Path part for operation mockCasGetSupplierByName
   */
  static readonly MockCasGetSupplierByNamePath = '/api/MockCas/cfs/supplierbyname/{supplierName}/{postalCode}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `mockCasGetSupplierByName()` instead.
   *
   * This method doesn't expect any request body.
   */
  mockCasGetSupplierByName$Response(params: {
    supplierName: string;
    postalCode: string;
  }): Observable<StrictHttpResponse<GetSupplierResponse>> {

    const rb = new RequestBuilder(this.rootUrl, MockCasService.MockCasGetSupplierByNamePath, 'get');
    if (params) {
      rb.path('supplierName', params.supplierName, {});
      rb.path('postalCode', params.postalCode, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<GetSupplierResponse>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `mockCasGetSupplierByName$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  mockCasGetSupplierByName(params: {
    supplierName: string;
    postalCode: string;
  }): Observable<GetSupplierResponse> {

    return this.mockCasGetSupplierByName$Response(params).pipe(
      map((r: StrictHttpResponse<GetSupplierResponse>) => r.body as GetSupplierResponse)
    );
  }

  /**
   * Path part for operation mockCasCreateSupplier
   */
  static readonly MockCasCreateSupplierPath = '/api/MockCas/cfs/supplier';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `mockCasCreateSupplier()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  mockCasCreateSupplier$Response(params: {
    body: CreateSupplierRequest
  }): Observable<StrictHttpResponse<CreateSupplierResponse>> {

    const rb = new RequestBuilder(this.rootUrl, MockCasService.MockCasCreateSupplierPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<CreateSupplierResponse>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `mockCasCreateSupplier$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  mockCasCreateSupplier(params: {
    body: CreateSupplierRequest
  }): Observable<CreateSupplierResponse> {

    return this.mockCasCreateSupplier$Response(params).pipe(
      map((r: StrictHttpResponse<CreateSupplierResponse>) => r.body as CreateSupplierResponse)
    );
  }

  /**
   * Path part for operation mockCasGetInvoice
   */
  static readonly MockCasGetInvoicePath = '/api/MockCas/cfs/apinvoice/paymentsearch/{payGroup}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `mockCasGetInvoice()` instead.
   *
   * This method doesn't expect any request body.
   */
  mockCasGetInvoice$Response(params: {
    payGroup: string;
    invoicenumber?: string;
    suppliernumber?: string;
    sitecode?: string;
    paymentstatus?: string;
    paymentnumber?: string;
    invoicecreationdatefrom?: string;
    invoicecreationdateto?: string;
    paymentstatusdatefrom?: string;
    paymentstatusdateto?: string;
    page?: string;
  }): Observable<StrictHttpResponse<GetInvoiceResponse>> {

    const rb = new RequestBuilder(this.rootUrl, MockCasService.MockCasGetInvoicePath, 'get');
    if (params) {
      rb.path('payGroup', params.payGroup, {});
      rb.query('invoicenumber', params.invoicenumber, {});
      rb.query('suppliernumber', params.suppliernumber, {});
      rb.query('sitecode', params.sitecode, {});
      rb.query('paymentstatus', params.paymentstatus, {});
      rb.query('paymentnumber', params.paymentnumber, {});
      rb.query('invoicecreationdatefrom', params.invoicecreationdatefrom, {});
      rb.query('invoicecreationdateto', params.invoicecreationdateto, {});
      rb.query('paymentstatusdatefrom', params.paymentstatusdatefrom, {});
      rb.query('paymentstatusdateto', params.paymentstatusdateto, {});
      rb.query('page', params.page, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<GetInvoiceResponse>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `mockCasGetInvoice$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  mockCasGetInvoice(params: {
    payGroup: string;
    invoicenumber?: string;
    suppliernumber?: string;
    sitecode?: string;
    paymentstatus?: string;
    paymentnumber?: string;
    invoicecreationdatefrom?: string;
    invoicecreationdateto?: string;
    paymentstatusdatefrom?: string;
    paymentstatusdateto?: string;
    page?: string;
  }): Observable<GetInvoiceResponse> {

    return this.mockCasGetInvoice$Response(params).pipe(
      map((r: StrictHttpResponse<GetInvoiceResponse>) => r.body as GetInvoiceResponse)
    );
  }

}
