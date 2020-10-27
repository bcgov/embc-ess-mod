/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { StrictHttpResponse } from './strict-http-response';
import { RequestBuilder } from './request-builder';
import { Observable, throwError } from 'rxjs';
import { map, filter, catchError } from 'rxjs/operators';

import { Country } from './models/country';
import { Jurisdiction } from './models/jurisdiction';
import { JurisdictionType } from './models/jurisdiction-type';
import { StateProvince } from './models/state-province';

@Injectable({
  providedIn: 'root',
})
export class LocationService {

  constructor(private http: HttpClient) {}
 
  get headers(): HttpHeaders {
    return new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json' });
  }

  /**
   * Path part for operation locationGetCountries
   */
  private readonly locationGetCountriesPath = `/api/location/countries`;
  private readonly locationGetJurisdictionsPath = `/api/location/jurisdictions`;
  private readonly locationGetStateProvincesPath = `/api/location/stateprovinces`;

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `locationGetCountries()` instead.
   *
   * This method doesn't expect any request body.
   */
  // locationGetCountries$Response(params?: {

  // }): Observable<StrictHttpResponse<Array<Country>>> {

  //   const rb = new RequestBuilder(this.rootUrl, LocationService.LocationGetCountriesPath, 'get');
  //   if (params) {


  //   }
  //   console.log("2")
  //   return this.http.get<any>(`/api/location/countries`, { headers: this.headers }).pipe(
  //     filter((r: any) => {
  //       console.log(r)
  //       return r instanceof HttpResponse}),
  //     map((r: HttpResponse<any>) => {
  //       console.log(r)
  //       console.log("-----")
  //       return r as StrictHttpResponse<Array<Country>>;
  //     })
  //   );
  // }

  // locationGetCountries$Response(params?: {

  // }): Observable<StrictHttpResponse<Array<Country>>> {

  //   const rb = new RequestBuilder(this.rootUrl, LocationService.LocationGetCountriesPath, 'get');
  //   if (params) {


  //   }
  //   return this.http.request(rb.build({
  //     responseType: 'json',
  //     accept: 'application/json'
  //   })).pipe(
  //     filter((r: any) => r instanceof HttpResponse),
  //     map((r: HttpResponse<any>) => {
  //       return r as StrictHttpResponse<Array<Country>>;
  //     })
  //   );
  // }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `locationGetCountries$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  locationGetCountries(): Observable<Array<Country>> {
    return this.http.get<Array<Country>>(this.locationGetCountriesPath, { headers: this.headers }).pipe(
      catchError(error => {
        return this.handleError(error);
      })
    );
  }

  locationGetJurisdictions(params?: {
    types?: null | Array<JurisdictionType>;
    countryCode?: null | string;
    stateProvinceCode?: null | string;
  }): Observable<Array<Jurisdiction>> {
    return this.http.get<Array<Jurisdiction>>(this.locationGetJurisdictionsPath, { headers: this.headers }).pipe(
      catchError(error => {
        return this.handleError(error);
      })
    );
  }

  locationGetStateProvinces(params?: {
    countryCode?: null | string;
  }): Observable<Array<StateProvince>> {
    return this.http.get<Array<StateProvince>>(this.locationGetStateProvincesPath, { headers: this.headers, params }).pipe(
      catchError(error => {
        return this.handleError(error);
      })
    );
  }


  protected handleError(err): Observable<never> {
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = err.error.message;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = err.error;
    }
    return throwError(errorMessage);
  }

  // locationGetCountries(params?: {

  // }): Observable<Array<Country>> {
  //   console.log("1")
  //   return this.locationGetCountries$Response(params).pipe(
  //     map((r: StrictHttpResponse<Array<Country>>) => {
  //       console.log(r)
  //       console.log("------")
  //       return r.body as Array<Country>
  //     })
  //   );
  // }

  /**
   * Path part for operation locationGetStateProvinces
   */
  

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `locationGetStateProvinces()` instead.
   *
   * This method doesn't expect any request body.
   */
  // locationGetStateProvinces$Response(params?: {
  //   countryCode?: null | string;

  // }): Observable<StrictHttpResponse<Array<StateProvince>>> {

  //   const rb = new RequestBuilder(this.rootUrl, this.locationGetStateProvincesPath, 'get');
  //   if (params) {

  //     rb.query('countryCode', params.countryCode, {});

  //   }
  //   return this.http.request(rb.build({
  //     responseType: 'json',
  //     accept: 'application/json'
  //   })).pipe(
  //     filter((r: any) => r instanceof HttpResponse),
  //     map((r: HttpResponse<any>) => {
  //       return r as StrictHttpResponse<Array<StateProvince>>;
  //     })
  //   );
  // }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `locationGetStateProvinces$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  // locationGetStateProvinces(params?: {
  //   countryCode?: null | string;

  // }): Observable<Array<StateProvince>> {

  //   return this.locationGetStateProvinces$Response(params).pipe(
  //     map((r: StrictHttpResponse<Array<StateProvince>>) => r.body as Array<StateProvince>)
  //   );
  // }

  /**
   * Path part for operation locationGetJurisdictions
   */


  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `locationGetJurisdictions()` instead.
   *
   * This method doesn't expect any request body.
   */
  // locationGetJurisdictions$Response(params?: {
  //   types?: null | Array<JurisdictionType>;
  //   countryCode?: null | string;
  //   stateProvinceCode?: null | string;

  // }): Observable<StrictHttpResponse<Array<Jurisdiction>>> {

  //   const rb = new RequestBuilder(this.rootUrl, this.locationGetJurisdictionsPath, 'get');
  //   if (params) {

  //     rb.query('types', params.types, { "style": "form", "explode": true });
  //     rb.query('countryCode', params.countryCode, {});
  //     rb.query('stateProvinceCode', params.stateProvinceCode, {});

  //   }
  //   return this.http.request(rb.build({
  //     responseType: 'json',
  //     accept: 'application/json'
  //   })).pipe(
  //     filter((r: any) => r instanceof HttpResponse),
  //     map((r: HttpResponse<any>) => {
  //       return r as StrictHttpResponse<Array<Jurisdiction>>;
  //     })
  //   );
  // }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `locationGetJurisdictions$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  // locationGetJurisdictions(params?: {
  //   types?: null | Array<JurisdictionType>;
  //   countryCode?: null | string;
  //   stateProvinceCode?: null | string;

  // }): Observable<Array<Jurisdiction>> {

  //   return this.locationGetJurisdictions$Response(params).pipe(
  //     map((r: StrictHttpResponse<Array<Jurisdiction>>) => r.body as Array<Jurisdiction>)
  //   );
  // }

}
