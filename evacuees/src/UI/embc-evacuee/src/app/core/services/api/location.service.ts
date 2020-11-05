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

}
