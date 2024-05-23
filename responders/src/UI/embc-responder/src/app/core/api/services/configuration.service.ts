/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { Code } from '../models/code';
import { CommunityCode } from '../models/community-code';
import { Configuration } from '../models/configuration';
import { configurationGetAuditOptions } from '../fn/configuration/configuration-get-audit-options';
import { ConfigurationGetAuditOptions$Params } from '../fn/configuration/configuration-get-audit-options';
import { configurationGetCodes } from '../fn/configuration/configuration-get-codes';
import { ConfigurationGetCodes$Params } from '../fn/configuration/configuration-get-codes';
import { configurationGetCommunities } from '../fn/configuration/configuration-get-communities';
import { ConfigurationGetCommunities$Params } from '../fn/configuration/configuration-get-communities';
import { configurationGetConfiguration } from '../fn/configuration/configuration-get-configuration';
import { ConfigurationGetConfiguration$Params } from '../fn/configuration/configuration-get-configuration';
import { configurationGetCountries } from '../fn/configuration/configuration-get-countries';
import { ConfigurationGetCountries$Params } from '../fn/configuration/configuration-get-countries';
import { configurationGetOutageInfo } from '../fn/configuration/configuration-get-outage-info';
import { ConfigurationGetOutageInfo$Params } from '../fn/configuration/configuration-get-outage-info';
import { configurationGetSecurityQuestions } from '../fn/configuration/configuration-get-security-questions';
import { ConfigurationGetSecurityQuestions$Params } from '../fn/configuration/configuration-get-security-questions';
import { configurationGetStateProvinces } from '../fn/configuration/configuration-get-state-provinces';
import { ConfigurationGetStateProvinces$Params } from '../fn/configuration/configuration-get-state-provinces';
import { OutageInformation } from '../models/outage-information';

@Injectable({ providedIn: 'root' })
export class ConfigurationService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `configurationGetConfiguration()` */
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
  configurationGetConfiguration$Response(
    params?: ConfigurationGetConfiguration$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<Configuration>> {
    return configurationGetConfiguration(this.http, this.rootUrl, params, context);
  }

  /**
   * Get configuration settings for clients.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `configurationGetConfiguration$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  configurationGetConfiguration(
    params?: ConfigurationGetConfiguration$Params,
    context?: HttpContext
  ): Observable<Configuration> {
    return this.configurationGetConfiguration$Response(params, context).pipe(
      map((r: StrictHttpResponse<Configuration>): Configuration => r.body)
    );
  }

  /** Path part for operation `configurationGetCodes()` */
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
  configurationGetCodes$Response(
    params?: ConfigurationGetCodes$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<Array<Code>>> {
    return configurationGetCodes(this.http, this.rootUrl, params, context);
  }

  /**
   * Get code values and descriptions for lookups and enum types.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `configurationGetCodes$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  configurationGetCodes(params?: ConfigurationGetCodes$Params, context?: HttpContext): Observable<Array<Code>> {
    return this.configurationGetCodes$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<Code>>): Array<Code> => r.body)
    );
  }

  /** Path part for operation `configurationGetCommunities()` */
  static readonly ConfigurationGetCommunitiesPath = '/api/Configuration/codes/communities';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `configurationGetCommunities()` instead.
   *
   * This method doesn't expect any request body.
   */
  configurationGetCommunities$Response(
    params?: ConfigurationGetCommunities$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<Array<CommunityCode>>> {
    return configurationGetCommunities(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `configurationGetCommunities$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  configurationGetCommunities(
    params?: ConfigurationGetCommunities$Params,
    context?: HttpContext
  ): Observable<Array<CommunityCode>> {
    return this.configurationGetCommunities$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<CommunityCode>>): Array<CommunityCode> => r.body)
    );
  }

  /** Path part for operation `configurationGetStateProvinces()` */
  static readonly ConfigurationGetStateProvincesPath = '/api/Configuration/codes/stateprovinces';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `configurationGetStateProvinces()` instead.
   *
   * This method doesn't expect any request body.
   */
  configurationGetStateProvinces$Response(
    params?: ConfigurationGetStateProvinces$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<Array<CommunityCode>>> {
    return configurationGetStateProvinces(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `configurationGetStateProvinces$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  configurationGetStateProvinces(
    params?: ConfigurationGetStateProvinces$Params,
    context?: HttpContext
  ): Observable<Array<CommunityCode>> {
    return this.configurationGetStateProvinces$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<CommunityCode>>): Array<CommunityCode> => r.body)
    );
  }

  /** Path part for operation `configurationGetCountries()` */
  static readonly ConfigurationGetCountriesPath = '/api/Configuration/codes/countries';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `configurationGetCountries()` instead.
   *
   * This method doesn't expect any request body.
   */
  configurationGetCountries$Response(
    params?: ConfigurationGetCountries$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<Array<CommunityCode>>> {
    return configurationGetCountries(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `configurationGetCountries$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  configurationGetCountries(
    params?: ConfigurationGetCountries$Params,
    context?: HttpContext
  ): Observable<Array<CommunityCode>> {
    return this.configurationGetCountries$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<CommunityCode>>): Array<CommunityCode> => r.body)
    );
  }

  /** Path part for operation `configurationGetSecurityQuestions()` */
  static readonly ConfigurationGetSecurityQuestionsPath = '/api/Configuration/security-questions';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `configurationGetSecurityQuestions()` instead.
   *
   * This method doesn't expect any request body.
   */
  configurationGetSecurityQuestions$Response(
    params?: ConfigurationGetSecurityQuestions$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<Array<string>>> {
    return configurationGetSecurityQuestions(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `configurationGetSecurityQuestions$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  configurationGetSecurityQuestions(
    params?: ConfigurationGetSecurityQuestions$Params,
    context?: HttpContext
  ): Observable<Array<string>> {
    return this.configurationGetSecurityQuestions$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<string>>): Array<string> => r.body)
    );
  }

  /** Path part for operation `configurationGetOutageInfo()` */
  static readonly ConfigurationGetOutageInfoPath = '/api/Configuration/outage-info';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `configurationGetOutageInfo()` instead.
   *
   * This method doesn't expect any request body.
   */
  configurationGetOutageInfo$Response(
    params?: ConfigurationGetOutageInfo$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<OutageInformation>> {
    return configurationGetOutageInfo(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `configurationGetOutageInfo$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  configurationGetOutageInfo(
    params?: ConfigurationGetOutageInfo$Params,
    context?: HttpContext
  ): Observable<OutageInformation> {
    return this.configurationGetOutageInfo$Response(params, context).pipe(
      map((r: StrictHttpResponse<OutageInformation>): OutageInformation => r.body)
    );
  }

  /** Path part for operation `configurationGetAuditOptions()` */
  static readonly ConfigurationGetAuditOptionsPath = '/api/Configuration/access-reasons';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `configurationGetAuditOptions()` instead.
   *
   * This method doesn't expect any request body.
   */
  configurationGetAuditOptions$Response(
    params?: ConfigurationGetAuditOptions$Params,
    context?: HttpContext
  ): Observable<
    StrictHttpResponse<{
      [key: string]: string;
    }>
  > {
    return configurationGetAuditOptions(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `configurationGetAuditOptions$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  configurationGetAuditOptions(
    params?: ConfigurationGetAuditOptions$Params,
    context?: HttpContext
  ): Observable<{
    [key: string]: string;
  }> {
    return this.configurationGetAuditOptions$Response(params, context).pipe(
      map(
        (
          r: StrictHttpResponse<{
            [key: string]: string;
          }>
        ): {
          [key: string]: string;
        } => r.body
      )
    );
  }
}
