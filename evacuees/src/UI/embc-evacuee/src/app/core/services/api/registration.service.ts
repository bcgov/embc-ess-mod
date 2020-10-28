/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { StrictHttpResponse } from './strict-http-response';
import { RequestBuilder } from './request-builder';
import { Observable, throwError } from 'rxjs';
import { map, filter, catchError } from 'rxjs/operators';

import { AnonymousRegistration } from './models/anonymous-registration';
import { RegistrationResult } from './models/registration-result';

@Injectable({
  providedIn: 'root',
})
export class RegistrationService  {

  constructor(private http: HttpClient) {}
  
  /**
   * Path part for operation registrationCreate
   */
  private readonly registrationCreatePath = `/api/registration`;

  get headers(): HttpHeaders {
    return new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json' });
  }

  /**
   * Register a new anonymous registrant and preliminary needs assessment.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registrationCreate()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  // registrationCreate$Response(params: {
  
  
  //   body: AnonymousRegistration
  // }): Observable<StrictHttpResponse<RegistrationResult>> {

  //   const rb = new RequestBuilder(this.rootUrl, RegistrationService.RegistrationCreatePath, 'post');
  //   if (params) {


  //     rb.body(params.body, 'application/json');
  //   }
  //   return this.http.request(rb.build({
  //     responseType: 'json',
  //     accept: 'application/json'
  //   })).pipe(
  //     filter((r: any) => r instanceof HttpResponse),
  //     map((r: HttpResponse<any>) => {
  //       return r as StrictHttpResponse<RegistrationResult>;
  //     })
  //   );
  // }

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
  registrationCreate(params:  AnonymousRegistration) {
    return this.http.post(this.registrationCreatePath, params, {headers: this.headers }).pipe(catchError(error => {
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
      errorMessage = err.error;
    }
    return throwError(errorMessage);
  }

}
