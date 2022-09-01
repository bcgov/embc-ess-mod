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

import { Invoice } from '../models/invoice';
import { InvoiceItem } from '../models/invoice-item';
import { SetPaymentRequest } from '../models/set-payment-request';

@Injectable({
  providedIn: 'root',
})
export class InvoicesService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation invoicesGet
   */
  static readonly InvoicesGetPath = '/api/Invoices';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `invoicesGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  invoicesGet$Response(params?: {
  }): Observable<StrictHttpResponse<Array<Invoice>>> {

    const rb = new RequestBuilder(this.rootUrl, InvoicesService.InvoicesGetPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<Invoice>>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `invoicesGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  invoicesGet(params?: {
  }): Observable<Array<Invoice>> {

    return this.invoicesGet$Response(params).pipe(
      map((r: StrictHttpResponse<Array<Invoice>>) => r.body as Array<Invoice>)
    );
  }

  /**
   * Path part for operation invoicesGetInvoiceItems
   */
  static readonly InvoicesGetInvoiceItemsPath = '/api/Invoices/items';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `invoicesGetInvoiceItems()` instead.
   *
   * This method doesn't expect any request body.
   */
  invoicesGetInvoiceItems$Response(params?: {
  }): Observable<StrictHttpResponse<Array<InvoiceItem>>> {

    const rb = new RequestBuilder(this.rootUrl, InvoicesService.InvoicesGetInvoiceItemsPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<InvoiceItem>>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `invoicesGetInvoiceItems$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  invoicesGetInvoiceItems(params?: {
  }): Observable<Array<InvoiceItem>> {

    return this.invoicesGetInvoiceItems$Response(params).pipe(
      map((r: StrictHttpResponse<Array<InvoiceItem>>) => r.body as Array<InvoiceItem>)
    );
  }

  /**
   * Path part for operation invoicesSetPaymentDate
   */
  static readonly InvoicesSetPaymentDatePath = '/api/Invoices/{invoiceNumber}/payment';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `invoicesSetPaymentDate()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  invoicesSetPaymentDate$Response(params: {
    invoiceNumber: string;
    body: SetPaymentRequest
  }): Observable<StrictHttpResponse<number>> {

    const rb = new RequestBuilder(this.rootUrl, InvoicesService.InvoicesSetPaymentDatePath, 'post');
    if (params) {
      rb.path('invoiceNumber', params.invoiceNumber, {});
      rb.body(params.body, 'application/json');
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
   * To access the full response (for headers, for example), `invoicesSetPaymentDate$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  invoicesSetPaymentDate(params: {
    invoiceNumber: string;
    body: SetPaymentRequest
  }): Observable<number> {

    return this.invoicesSetPaymentDate$Response(params).pipe(
      map((r: StrictHttpResponse<number>) => r.body as number)
    );
  }

  /**
   * Path part for operation invoicesDeleteInvoiceByNumber
   */
  static readonly InvoicesDeleteInvoiceByNumberPath = '/api/Invoices/{invoiceNumber}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `invoicesDeleteInvoiceByNumber()` instead.
   *
   * This method doesn't expect any request body.
   */
  invoicesDeleteInvoiceByNumber$Response(params: {
    invoiceNumber: string;
  }): Observable<StrictHttpResponse<number>> {

    const rb = new RequestBuilder(this.rootUrl, InvoicesService.InvoicesDeleteInvoiceByNumberPath, 'delete');
    if (params) {
      rb.path('invoiceNumber', params.invoiceNumber, {});
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
   * To access the full response (for headers, for example), `invoicesDeleteInvoiceByNumber$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  invoicesDeleteInvoiceByNumber(params: {
    invoiceNumber: string;
  }): Observable<number> {

    return this.invoicesDeleteInvoiceByNumber$Response(params).pipe(
      map((r: StrictHttpResponse<number>) => r.body as number)
    );
  }

}
