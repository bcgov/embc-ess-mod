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

import { Code } from '../models/code';
import { CommunityCode } from '../models/community-code';
import { CommunityType } from '../models/community-type';
import { Configuration } from '../models/configuration';
import { OutageInformation } from '../models/outage-information';

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
  }): Observable<StrictHttpResponse<Array<Code>>> {

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
        return r as StrictHttpResponse<Array<Code>>;
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
  }): Observable<Array<Code>> {

    return this.configurationGetCodes$Response(params).pipe(
      map((r: StrictHttpResponse<Array<Code>>) => r.body as Array<Code>)
    );
  }

  /**
   * Path part for operation configurationGetCommunities
   */
  static readonly ConfigurationGetCommunitiesPath = '/api/Configuration/codes/communities';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `configurationGetCommunities()` instead.
   *
   * This method doesn't expect any request body.
   */
  configurationGetCommunities$Response(params?: {
    stateProvinceId?: string;
    countryId?: string;
    types?: Array<CommunityType>;
  }): Observable<StrictHttpResponse<Array<CommunityCode>>> {

    const rb = new RequestBuilder(this.rootUrl, ConfigurationService.ConfigurationGetCommunitiesPath, 'get');
    if (params) {
      rb.query('stateProvinceId', params.stateProvinceId, {});
      rb.query('countryId', params.countryId, {});
      rb.query('types', params.types, {"style":"form","explode":true});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<CommunityCode>>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `configurationGetCommunities$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  configurationGetCommunities(params?: {
    stateProvinceId?: string;
    countryId?: string;
    types?: Array<CommunityType>;
  }): Observable<Array<CommunityCode>> {

    return this.configurationGetCommunities$Response(params).pipe(
      map((r: StrictHttpResponse<Array<CommunityCode>>) => r.body as Array<CommunityCode>)
    );
  }

  /**
   * Path part for operation configurationGetStateProvinces
   */
  static readonly ConfigurationGetStateProvincesPath = '/api/Configuration/codes/stateprovinces';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `configurationGetStateProvinces()` instead.
   *
   * This method doesn't expect any request body.
   */
  configurationGetStateProvinces$Response(params?: {
    countryId?: string;
  }): Observable<StrictHttpResponse<Array<CommunityCode>>> {

    const rb = new RequestBuilder(this.rootUrl, ConfigurationService.ConfigurationGetStateProvincesPath, 'get');
    if (params) {
      rb.query('countryId', params.countryId, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<CommunityCode>>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `configurationGetStateProvinces$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  configurationGetStateProvinces(params?: {
    countryId?: string;
  }): Observable<Array<CommunityCode>> {

    return this.configurationGetStateProvinces$Response(params).pipe(
      map((r: StrictHttpResponse<Array<CommunityCode>>) => r.body as Array<CommunityCode>)
    );
  }

  /**
   * Path part for operation configurationGetCountries
   */
  static readonly ConfigurationGetCountriesPath = '/api/Configuration/codes/countries';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `configurationGetCountries()` instead.
   *
   * This method doesn't expect any request body.
   */
  configurationGetCountries$Response(params?: {
  }): Observable<StrictHttpResponse<Array<CommunityCode>>> {

    const rb = new RequestBuilder(this.rootUrl, ConfigurationService.ConfigurationGetCountriesPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<CommunityCode>>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `configurationGetCountries$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  configurationGetCountries(params?: {
  }): Observable<Array<CommunityCode>> {

    return this.configurationGetCountries$Response(params).pipe(
      map((r: StrictHttpResponse<Array<CommunityCode>>) => r.body as Array<CommunityCode>)
    );
  }

  /**
   * Path part for operation configurationGetSecurityQuestions
   */
  static readonly ConfigurationGetSecurityQuestionsPath = '/api/Configuration/security-questions';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `configurationGetSecurityQuestions()` instead.
   *
   * This method doesn't expect any request body.
   */
  configurationGetSecurityQuestions$Response(params?: {
  }): Observable<StrictHttpResponse<Array<string>>> {

    const rb = new RequestBuilder(this.rootUrl, ConfigurationService.ConfigurationGetSecurityQuestionsPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<string>>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `configurationGetSecurityQuestions$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  configurationGetSecurityQuestions(params?: {
  }): Observable<Array<string>> {

    return this.configurationGetSecurityQuestions$Response(params).pipe(
      map((r: StrictHttpResponse<Array<string>>) => r.body as Array<string>)
    );
  }

  /**
   * Path part for operation configurationGetOutageInfo
   */
  static readonly ConfigurationGetOutageInfoPath = '/api/Configuration/outage-info';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `configurationGetOutageInfo()` instead.
   *
   * This method doesn't expect any request body.
   */
  configurationGetOutageInfo$Response(params?: {
  }): Observable<StrictHttpResponse<OutageInformation>> {

    const rb = new RequestBuilder(this.rootUrl, ConfigurationService.ConfigurationGetOutageInfoPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<OutageInformation>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `configurationGetOutageInfo$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  configurationGetOutageInfo(params?: {
  }): Observable<OutageInformation> {

    return this.configurationGetOutageInfo$Response(params).pipe(
      map((r: StrictHttpResponse<OutageInformation>) => r.body as OutageInformation)
    );
  }

}
