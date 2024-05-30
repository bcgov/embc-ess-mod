/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { EvacuationFile } from '../models/evacuation-file';
import { evacuationsCreate } from '../fn/evacuations/evacuations-create';
import { EvacuationsCreate$Params } from '../fn/evacuations/evacuations-create';
import { evacuationsGetCurrentEvacuations } from '../fn/evacuations/evacuations-get-current-evacuations';
import { EvacuationsGetCurrentEvacuations$Params } from '../fn/evacuations/evacuations-get-current-evacuations';
import { evacuationsGetPastEvacuations } from '../fn/evacuations/evacuations-get-past-evacuations';
import { EvacuationsGetPastEvacuations$Params } from '../fn/evacuations/evacuations-get-past-evacuations';
import { evacuationsUpsertEvacuationFile } from '../fn/evacuations/evacuations-upsert-evacuation-file';
import { EvacuationsUpsertEvacuationFile$Params } from '../fn/evacuations/evacuations-upsert-evacuation-file';
import { RegistrationResult } from '../models/registration-result';

@Injectable({ providedIn: 'root' })
export class EvacuationsService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `evacuationsCreate()` */
  static readonly EvacuationsCreatePath = '/api/Evacuations/create-registration-anonymous';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `evacuationsCreate()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  evacuationsCreate$Response(
    params?: EvacuationsCreate$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<RegistrationResult>> {
    return evacuationsCreate(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `evacuationsCreate$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  evacuationsCreate(params?: EvacuationsCreate$Params, context?: HttpContext): Observable<RegistrationResult> {
    return this.evacuationsCreate$Response(params, context).pipe(
      map((r: StrictHttpResponse<RegistrationResult>): RegistrationResult => r.body)
    );
  }

  /** Path part for operation `evacuationsGetCurrentEvacuations()` */
  static readonly EvacuationsGetCurrentEvacuationsPath = '/api/Evacuations/current';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `evacuationsGetCurrentEvacuations()` instead.
   *
   * This method doesn't expect any request body.
   */
  evacuationsGetCurrentEvacuations$Response(
    params?: EvacuationsGetCurrentEvacuations$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<Array<EvacuationFile>>> {
    return evacuationsGetCurrentEvacuations(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `evacuationsGetCurrentEvacuations$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  evacuationsGetCurrentEvacuations(
    params?: EvacuationsGetCurrentEvacuations$Params,
    context?: HttpContext
  ): Observable<Array<EvacuationFile>> {
    return this.evacuationsGetCurrentEvacuations$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<EvacuationFile>>): Array<EvacuationFile> => r.body)
    );
  }

  /** Path part for operation `evacuationsGetPastEvacuations()` */
  static readonly EvacuationsGetPastEvacuationsPath = '/api/Evacuations/past';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `evacuationsGetPastEvacuations()` instead.
   *
   * This method doesn't expect any request body.
   */
  evacuationsGetPastEvacuations$Response(
    params?: EvacuationsGetPastEvacuations$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<Array<EvacuationFile>>> {
    return evacuationsGetPastEvacuations(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `evacuationsGetPastEvacuations$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  evacuationsGetPastEvacuations(
    params?: EvacuationsGetPastEvacuations$Params,
    context?: HttpContext
  ): Observable<Array<EvacuationFile>> {
    return this.evacuationsGetPastEvacuations$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<EvacuationFile>>): Array<EvacuationFile> => r.body)
    );
  }

  /** Path part for operation `evacuationsUpsertEvacuationFile()` */
  static readonly EvacuationsUpsertEvacuationFilePath = '/api/Evacuations';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `evacuationsUpsertEvacuationFile()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  evacuationsUpsertEvacuationFile$Response(
    params?: EvacuationsUpsertEvacuationFile$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<RegistrationResult>> {
    return evacuationsUpsertEvacuationFile(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `evacuationsUpsertEvacuationFile$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  evacuationsUpsertEvacuationFile(
    params?: EvacuationsUpsertEvacuationFile$Params,
    context?: HttpContext
  ): Observable<RegistrationResult> {
    return this.evacuationsUpsertEvacuationFile$Response(params, context).pipe(
      map((r: StrictHttpResponse<RegistrationResult>): RegistrationResult => r.body)
    );
  }
}
