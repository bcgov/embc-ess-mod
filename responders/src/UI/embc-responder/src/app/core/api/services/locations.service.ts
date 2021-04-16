/* eslint-disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';
import { RequestBuilder } from '../request-builder';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { Community } from '../models/community';
import { CommunityType } from '../models/community-type';
import { CommunityTypeDescription } from '../models/community-type-description';
import { Country } from '../models/country';
import { StateProvince } from '../models/state-province';

@Injectable({
  providedIn: 'root',
})
export class LocationsService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation locationsGetCommunities
   */
  static readonly LocationsGetCommunitiesPath = '/api/Locations/communities';

  /**
   * Provides a filtered list of communities by community type, state/province and/or country.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `locationsGetCommunities()` instead.
   *
   * This method doesn't expect any request body.
   */
  locationsGetCommunities$Response(params?: {

    /**
     * state/province filter
     */
    stateProvinceId?: string;

    /**
     * country filter
     */
    countryId?: string;

    /**
     * community type filter
     */
    types?: Array<CommunityType>;
  }): Observable<StrictHttpResponse<Array<Community>>> {

    const rb = new RequestBuilder(this.rootUrl, LocationsService.LocationsGetCommunitiesPath, 'get');
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
        return r as StrictHttpResponse<Array<Community>>;
      })
    );
  }

  /**
   * Provides a filtered list of communities by community type, state/province and/or country.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `locationsGetCommunities$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  locationsGetCommunities(params?: {

    /**
     * state/province filter
     */
    stateProvinceId?: string;

    /**
     * country filter
     */
    countryId?: string;

    /**
     * community type filter
     */
    types?: Array<CommunityType>;
  }): Observable<Array<Community>> {

    return this.locationsGetCommunities$Response(params).pipe(
      map((r: StrictHttpResponse<Array<Community>>) => r.body as Array<Community>)
    );
  }

  /**
   * Path part for operation locationsGetStateProvinces
   */
  static readonly LocationsGetStateProvincesPath = '/api/Locations/stateprovinces';

  /**
   * Provides a filtered list of state/provinces by country.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `locationsGetStateProvinces()` instead.
   *
   * This method doesn't expect any request body.
   */
  locationsGetStateProvinces$Response(params?: {

    /**
     * country filter
     */
    countryId?: string;
  }): Observable<StrictHttpResponse<Array<StateProvince>>> {

    const rb = new RequestBuilder(this.rootUrl, LocationsService.LocationsGetStateProvincesPath, 'get');
    if (params) {
      rb.query('countryId', params.countryId, {});
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
   * Provides a filtered list of state/provinces by country.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `locationsGetStateProvinces$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  locationsGetStateProvinces(params?: {

    /**
     * country filter
     */
    countryId?: string;
  }): Observable<Array<StateProvince>> {

    return this.locationsGetStateProvinces$Response(params).pipe(
      map((r: StrictHttpResponse<Array<StateProvince>>) => r.body as Array<StateProvince>)
    );
  }

  /**
   * Path part for operation locationsGetCountries
   */
  static readonly LocationsGetCountriesPath = '/api/Locations/countries';

  /**
   * Provides a list of countries.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `locationsGetCountries()` instead.
   *
   * This method doesn't expect any request body.
   */
  locationsGetCountries$Response(params?: {
  }): Observable<StrictHttpResponse<Array<Country>>> {

    const rb = new RequestBuilder(this.rootUrl, LocationsService.LocationsGetCountriesPath, 'get');
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
   * Provides a list of countries.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `locationsGetCountries$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  locationsGetCountries(params?: {
  }): Observable<Array<Country>> {

    return this.locationsGetCountries$Response(params).pipe(
      map((r: StrictHttpResponse<Array<Country>>) => r.body as Array<Country>)
    );
  }

  /**
   * Path part for operation locationsGetCommunityTypes
   */
  static readonly LocationsGetCommunityTypesPath = '/api/Locations/communitytypes';

  /**
   * Provides a list of community types and their English description.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `locationsGetCommunityTypes()` instead.
   *
   * This method doesn't expect any request body.
   */
  locationsGetCommunityTypes$Response(params?: {
  }): Observable<StrictHttpResponse<Array<CommunityTypeDescription>>> {

    const rb = new RequestBuilder(this.rootUrl, LocationsService.LocationsGetCommunityTypesPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<CommunityTypeDescription>>;
      })
    );
  }

  /**
   * Provides a list of community types and their English description.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `locationsGetCommunityTypes$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  locationsGetCommunityTypes(params?: {
  }): Observable<Array<CommunityTypeDescription>> {

    return this.locationsGetCommunityTypes$Response(params).pipe(
      map((r: StrictHttpResponse<Array<CommunityTypeDescription>>) => r.body as Array<CommunityTypeDescription>)
    );
  }

}
