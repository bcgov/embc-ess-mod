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

import { CodeValues } from '../models/code-values';
import { Configuration } from '../models/configuration';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation configurationGetConfiguration
   */
  static readonly ConfigurationGetConfigurationPath = '/api/Configuration';

  /**
   * Get configuration settings for clients.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `configurationGetConfiguration()` instead.
   *
   * This method doesn't expect any request body.
   */
  configurationGetConfiguration$Response(params?: {
  }): Observable<StrictHttpResponse<Configuration>> {

    const rb = new RequestBuilder(this.rootUrl, ConfigurationService.ConfigurationGetConfigurationPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Configuration>;
      })
    );
  }

  /**
   * Get configuration settings for clients.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `configurationGetConfiguration$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  configurationGetConfiguration(params?: {
  }): Observable<Configuration> {

    return this.configurationGetConfiguration$Response(params).pipe(
      map((r: StrictHttpResponse<Configuration>) => r.body as Configuration)
    );
  }

  /**
   * Path part for operation configurationGetCodes
   */
  static readonly ConfigurationGetCodesPath = '/api/Configuration/codes';

  /**
   * Get code values and descriptions for lookups and enum types.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `configurationGetCodes()` instead.
   *
   * This method doesn't expect any request body.
   */
  configurationGetCodes$Response(params?: {

    /**
     * enum type name
     */
    forEnumType?: string;
  }): Observable<StrictHttpResponse<CodeValues>> {

    const rb = new RequestBuilder(this.rootUrl, ConfigurationService.ConfigurationGetCodesPath, 'get');
    if (params) {
      rb.query('forEnumType', params.forEnumType, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<CodeValues>;
      })
    );
  }

  /**
   * Get code values and descriptions for lookups and enum types.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `configurationGetCodes$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  configurationGetCodes(params?: {

    /**
     * enum type name
     */
    forEnumType?: string;
  }): Observable<CodeValues> {

    return this.configurationGetCodes$Response(params).pipe(
      map((r: StrictHttpResponse<CodeValues>) => r.body as CodeValues)
    );
  }

}
