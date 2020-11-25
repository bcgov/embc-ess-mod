/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AnonymousRegistration } from './models/anonymous-registration';
import { RegistrationResult } from './models/registration-result';
import { Registration } from '../../model/registration';
import { ProblemDetail } from '../../model/problemDetail';

@Injectable({
  providedIn: 'root',
})
export class RegistrationService {

  constructor(private http: HttpClient) { }

  /**
   * Path part for operation registrationCreate
   */
  private readonly registrationCreatePath = `/api/registration/create-registration-anonymous`;
  private readonly createProfilePath = `/api/registration/create-profile`

  get headers(): HttpHeaders {
    return new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json' });
  }

  /**
   * Register a new anonymous registrant and preliminary needs assessment.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `registrationCreate$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrationCreate(params: AnonymousRegistration): Observable<RegistrationResult> {
    return this.http.post<RegistrationResult>(this.registrationCreatePath, params, { headers: this.headers }).pipe(
      catchError(error => {
        return this.handleError(error);
      })
    );
  }

  registrationCreateProfile(params: Registration): Observable<ProblemDetail> {
    return this.http.post<ProblemDetail>(this.createProfilePath, params, { headers: this.headers }).pipe(
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
