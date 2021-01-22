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

import { Country } from '../models/country';
import { Jurisdiction } from '../models/jurisdiction';
import { JurisdictionType } from '../models/jurisdiction-type';
import { StateProvince } from '../models/state-province';

@Injectable({
  providedIn: 'root',
})
export class LocationService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation locationGetCountries
   */
  static readonly LocationGetCountriesPath = '/api/location/countries';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `locationGetCountries()` instead.
   *
   * This method doesn't expect any request body.
   */
  locationGetCountries$Response(params?: {
  }): Observable<StrictHttpResponse<Array<Country>>> {

    const rb = new RequestBuilder(this.rootUrl, LocationService.LocationGetCountriesPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<Country>>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `locationGetCountries$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  locationGetCountries(params?: {
  }): Observable<Array<Country>> {

    return this.locationGetCountries$Response(params).pipe(
      map((r: StrictHttpResponse<Array<Country>>) => r.body as Array<Country>)
    );
  }

  /**
   * Path part for operation locationGetStateProvinces
   */
  static readonly LocationGetStateProvincesPath = '/api/location/stateprovinces';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `locationGetStateProvinces()` instead.
   *
   * This method doesn't expect any request body.
   */
  locationGetStateProvinces$Response(params?: {
    countryCode?: string;
  }): Observable<StrictHttpResponse<Array<StateProvince>>> {

    const rb = new RequestBuilder(this.rootUrl, LocationService.LocationGetStateProvincesPath, 'get');
    if (params) {
      rb.query('countryCode', params.countryCode, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<StateProvince>>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `locationGetStateProvinces$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  locationGetStateProvinces(params?: {
    countryCode?: string;
  }): Observable<Array<StateProvince>> {

    return this.locationGetStateProvinces$Response(params).pipe(
      map((r: StrictHttpResponse<Array<StateProvince>>) => r.body as Array<StateProvince>)
    );
  }

  /**
   * Path part for operation locationGetJurisdictions
   */
  static readonly LocationGetJurisdictionsPath = '/api/location/jurisdictions';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `locationGetJurisdictions()` instead.
   *
   * This method doesn't expect any request body.
   */
  locationGetJurisdictions$Response(params?: {
    types?: Array<JurisdictionType>;
    countryCode?: string;
    stateProvinceCode?: string;
  }): Observable<StrictHttpResponse<Array<Jurisdiction>>> {

    const rb = new RequestBuilder(this.rootUrl, LocationService.LocationGetJurisdictionsPath, 'get');
    if (params) {
      rb.query('types', params.types, { "style": "form", "explode": true });
      rb.query('countryCode', params.countryCode, {});
      rb.query('stateProvinceCode', params.stateProvinceCode, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<Jurisdiction>>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `locationGetJurisdictions$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  locationGetJurisdictions(params?: {
    types?: Array<JurisdictionType>;
    countryCode?: string;
    stateProvinceCode?: string;
  }): Observable<Array<Jurisdiction>> {

    return this.locationGetJurisdictions$Response(params).pipe(
      map((r: StrictHttpResponse<Array<Jurisdiction>>) => r.body as Array<Jurisdiction>)
    );
  }

}
