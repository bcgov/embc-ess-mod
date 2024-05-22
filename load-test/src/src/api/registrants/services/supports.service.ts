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

import { DraftSupports } from '../models/draft-supports';
import { EligibilityCheck } from '../models/eligibility-check';
import { SelfServeClothingSupport } from '../models/self-serve-clothing-support';
import { SelfServeFoodGroceriesSupport } from '../models/self-serve-food-groceries-support';
import { SelfServeFoodRestaurantSupport } from '../models/self-serve-food-restaurant-support';
import { SelfServeIncidentalsSupport } from '../models/self-serve-incidentals-support';
import { SelfServeShelterAllowanceSupport } from '../models/self-serve-shelter-allowance-support';
import { SubmitSupportsRequest } from '../models/submit-supports-request';

@Injectable({
  providedIn: 'root',
})
export class SupportsService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation supportsCheckSelfServeEligibility
   */
  static readonly SupportsCheckSelfServeEligibilityPath = '/api/Evacuations/{evacuationFileId}/Supports/eligible';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `supportsCheckSelfServeEligibility()` instead.
   *
   * This method doesn't expect any request body.
   */
  supportsCheckSelfServeEligibility$Response(params: {
    evacuationFileId: string;
  }): Observable<StrictHttpResponse<EligibilityCheck>> {

    const rb = new RequestBuilder(this.rootUrl, SupportsService.SupportsCheckSelfServeEligibilityPath, 'get');
    if (params) {
      rb.path('evacuationFileId', params.evacuationFileId, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<EligibilityCheck>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `supportsCheckSelfServeEligibility$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  supportsCheckSelfServeEligibility(params: {
    evacuationFileId: string;
  }): Observable<EligibilityCheck> {

    return this.supportsCheckSelfServeEligibility$Response(params).pipe(
      map((r: StrictHttpResponse<EligibilityCheck>) => r.body as EligibilityCheck)
    );
  }

  /**
   * Path part for operation supportsGetDraftSupports
   */
  static readonly SupportsGetDraftSupportsPath = '/api/Evacuations/{evacuationFileId}/Supports/draft';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `supportsGetDraftSupports()` instead.
   *
   * This method doesn't expect any request body.
   */
  supportsGetDraftSupports$Response(params: {
    evacuationFileId: string;
  }): Observable<StrictHttpResponse<DraftSupports>> {

    const rb = new RequestBuilder(this.rootUrl, SupportsService.SupportsGetDraftSupportsPath, 'get');
    if (params) {
      rb.path('evacuationFileId', params.evacuationFileId, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<DraftSupports>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `supportsGetDraftSupports$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  supportsGetDraftSupports(params: {
    evacuationFileId: string;
  }): Observable<DraftSupports> {

    return this.supportsGetDraftSupports$Response(params).pipe(
      map((r: StrictHttpResponse<DraftSupports>) => r.body as DraftSupports)
    );
  }

  /**
   * Path part for operation supportsCalculateAmounts
   */
  static readonly SupportsCalculateAmountsPath = '/api/Evacuations/{evacuationFileId}/Supports/draft';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `supportsCalculateAmounts()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  supportsCalculateAmounts$Response(params: {
    evacuationFileId: string;
    body?: Array<(SelfServeShelterAllowanceSupport | SelfServeFoodGroceriesSupport | SelfServeFoodRestaurantSupport | SelfServeIncidentalsSupport | SelfServeClothingSupport)>
  }): Observable<StrictHttpResponse<Array<(SelfServeShelterAllowanceSupport | SelfServeFoodGroceriesSupport | SelfServeFoodRestaurantSupport | SelfServeIncidentalsSupport | SelfServeClothingSupport)>>> {

    const rb = new RequestBuilder(this.rootUrl, SupportsService.SupportsCalculateAmountsPath, 'post');
    if (params) {
      rb.path('evacuationFileId', params.evacuationFileId, {});
      rb.body(params.body, 'application/*+json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<(SelfServeShelterAllowanceSupport | SelfServeFoodGroceriesSupport | SelfServeFoodRestaurantSupport | SelfServeIncidentalsSupport | SelfServeClothingSupport)>>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `supportsCalculateAmounts$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  supportsCalculateAmounts(params: {
    evacuationFileId: string;
    body?: Array<(SelfServeShelterAllowanceSupport | SelfServeFoodGroceriesSupport | SelfServeFoodRestaurantSupport | SelfServeIncidentalsSupport | SelfServeClothingSupport)>
  }): Observable<Array<(SelfServeShelterAllowanceSupport | SelfServeFoodGroceriesSupport | SelfServeFoodRestaurantSupport | SelfServeIncidentalsSupport | SelfServeClothingSupport)>> {

    return this.supportsCalculateAmounts$Response(params).pipe(
      map((r: StrictHttpResponse<Array<(SelfServeShelterAllowanceSupport | SelfServeFoodGroceriesSupport | SelfServeFoodRestaurantSupport | SelfServeIncidentalsSupport | SelfServeClothingSupport)>>) => r.body as Array<(SelfServeShelterAllowanceSupport | SelfServeFoodGroceriesSupport | SelfServeFoodRestaurantSupport | SelfServeIncidentalsSupport | SelfServeClothingSupport)>)
    );
  }

  /**
   * Path part for operation supportsOptOut
   */
  static readonly SupportsOptOutPath = '/api/Evacuations/{evacuationFileId}/Supports/optout';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `supportsOptOut()` instead.
   *
   * This method doesn't expect any request body.
   */
  supportsOptOut$Response(params: {
    evacuationFileId: string;
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, SupportsService.SupportsOptOutPath, 'post');
    if (params) {
      rb.path('evacuationFileId', params.evacuationFileId, {});
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `supportsOptOut$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  supportsOptOut(params: {
    evacuationFileId: string;
  }): Observable<void> {

    return this.supportsOptOut$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation supportsSubmitSupports
   */
  static readonly SupportsSubmitSupportsPath = '/api/Evacuations/{evacuationFileId}/Supports';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `supportsSubmitSupports()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  supportsSubmitSupports$Response(params: {
    evacuationFileId: string;
    body?: SubmitSupportsRequest
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, SupportsService.SupportsSubmitSupportsPath, 'post');
    if (params) {
      rb.path('evacuationFileId', params.evacuationFileId, {});
      rb.body(params.body, 'application/*+json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `supportsSubmitSupports$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  supportsSubmitSupports(params: {
    evacuationFileId: string;
    body?: SubmitSupportsRequest
  }): Observable<void> {

    return this.supportsSubmitSupports$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

}
