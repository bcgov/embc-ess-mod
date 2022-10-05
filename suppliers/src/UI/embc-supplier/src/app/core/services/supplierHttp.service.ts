/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { ServerConfig } from '../model/server-config';
import { Community } from '../model/community';
import { catchError, publishReplay, refCount } from 'rxjs/operators';
import { Suppliers } from '../model/suppliers';
import { Country, SupportItems } from '../model/country';
import { SupplierService } from './supplier.service';

//
// Ref: https://github.com/bcgov/MyGovBC-CAPTCHA-Widget
//

// const BaseUrl = 'https://embcess-captcha.pathfinder.gov.bc.ca';
const baseUrl = 'https://embcess-captcha.apps.silver.devops.gov.bc.ca';

// payload returned from the server
@Injectable()
export class ServerPayload {
  nonce: string;
  captcha: string;
  validation: string;
  expiry: string;
}

@Injectable({
  providedIn: 'root',
})
export class SupplierHttpService {
  constructor(
    private http: HttpClient,
    private supplierService: SupplierService
  ) {}

  get headers(): HttpHeaders {
    return new HttpHeaders({ 'Content-Type': 'application/json' });
  }

  getServerConfig() {
    return this.http
      .get<ServerConfig>(`/api/Config`, { headers: this.headers })
      .pipe(
        publishReplay(1),
        refCount(),
        catchError((error) => {
          return this.handleError(error);
        })
      );
  }

  getListOfCities() {
    return this.http
      .get<Community[]>(`/api/Lists/jurisdictions`, { headers: this.headers })
      .pipe(
        catchError((error) => {
          return this.handleError(error);
        })
      );
  }

  getListOfProvinces() {
    return this.http
      .get<Community[]>(`/api/Lists/stateprovinces`, { headers: this.headers })
      .pipe(
        catchError((error) => {
          return this.handleError(error);
        })
      );
  }

  getListOfCountries() {
    return this.http
      .get<Country[]>(`/api/Lists/countries`, { headers: this.headers })
      .pipe(
        catchError((error) => {
          return this.handleError(error);
        })
      );
  }

  getListOfStates() {
    const params = { countryCode: 'USA' };
    return this.http
      .get<Community[]>(`/api/Lists/stateprovinces`, {
        headers: this.headers,
        params,
      })
      .pipe(
        catchError((error) => {
          return this.handleError(error);
        })
      );
  }

  getListOfSupportItems() {
    return this.http
      .get<SupportItems[]>(`/api/Lists/supports`, { headers: this.headers })
      .pipe(
        catchError((error) => {
          return this.handleError(error);
        })
      );
  }

  submitForm(suppliers: Suppliers) {
    return this.http
      .post(`/api/Submission`, suppliers, { headers: this.headers })
      .pipe(
        catchError((error) => {
          return this.handleError(error);
        })
      );
  }

  fetchData(nonce: string): Observable<HttpResponse<ServerPayload>> {
    return this.http.post<ServerPayload>(
      baseUrl + '/captcha',
      { nonce },
      { observe: 'response' }
    );
  }

  verifyCaptcha(
    nonce: string,
    answer: string,
    encryptedAnswer: string
  ): Observable<HttpResponse<ServerPayload>> {
    return this.http.post<ServerPayload>(
      baseUrl + '/verify/captcha',
      { nonce, answer, validation: encryptedAnswer },
      { observe: 'response' }
    );
  }

  fetchAudio(
    validation: string,
    translation?: string
  ): Observable<HttpResponse<string>> {
    const payload: any = { validation };
    if (translation) {
      payload.translation = translation;
    }
    return this.http.post<string>(baseUrl + '/captcha/audio', payload, {
      observe: 'response',
    });
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
