import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Community } from '../model/community';
import { catchError } from 'rxjs/operators';
import { Suppliers } from '../model/suppliers';
import { Country } from '../model/country';

@Injectable({
  providedIn: 'root',
})
export class SupplierHttpService {

  get headers(): HttpHeaders {
    return new HttpHeaders({ 'Content-Type': 'application/json' });
  }

  constructor(private http: HttpClient) { }

  getListOfCities() {
    return this.http
      .get<Community[]>(`/api/Lists/jurisdictions`, { headers: this.headers })
      .pipe(
        catchError(error => {
          return this.handleError(error);
        }));
  }

  getListOfProvinces() {
    return this.http
      .get<Community[]>(`/api/Lists/stateprovinces`, { headers: this.headers })
      .pipe(
        catchError(error => {
          return this.handleError(error);
        })
      ); 
  }

  getListOfCountries() {
    return this.http
      .get<Country[]>(`/api/Lists/countries`, { headers: this.headers })
      .pipe(
        catchError(error => {
          return this.handleError(error);
        }));
  }

  getListOfStates() {
    let params = {countryCode: 'US'}
    return this.http
      .get<Community[]>(`/api/Lists/stateprovinces`, { headers: this.headers, params })
      .pipe(
        catchError(error => {
          return this.handleError(error);
        })
      ); 
  }

  submitForm(suppliers: Suppliers) {
    console.log("inside submit http")
    return this.http.post(`/api/Submission`, suppliers, { headers: this.headers}).pipe(catchError(error => {
      return this.handleError(error);
    }))
  }

  protected handleError(err): Observable<never> {
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = err.error.message;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}, body was: ${err.message}`;
    }
    return throwError(errorMessage);
  }
}
