/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { DraftSupports } from '../models/draft-supports';
import { EligibilityCheck } from '../models/eligibility-check';
import { SelfServeClothingSupport } from '../models/self-serve-clothing-support';
import { SelfServeFoodGroceriesSupport } from '../models/self-serve-food-groceries-support';
import { SelfServeFoodRestaurantSupport } from '../models/self-serve-food-restaurant-support';
import { SelfServeIncidentalsSupport } from '../models/self-serve-incidentals-support';
import { SelfServeShelterAllowanceSupport } from '../models/self-serve-shelter-allowance-support';
import { supportsCalculateAmounts } from '../fn/supports/supports-calculate-amounts';
import { SupportsCalculateAmounts$Params } from '../fn/supports/supports-calculate-amounts';
import { supportsCheckSelfServeEligibility } from '../fn/supports/supports-check-self-serve-eligibility';
import { SupportsCheckSelfServeEligibility$Params } from '../fn/supports/supports-check-self-serve-eligibility';
import { supportsGetDraftSupports } from '../fn/supports/supports-get-draft-supports';
import { SupportsGetDraftSupports$Params } from '../fn/supports/supports-get-draft-supports';
import { supportsOptOut } from '../fn/supports/supports-opt-out';
import { SupportsOptOut$Params } from '../fn/supports/supports-opt-out';
import { supportsSubmitSupports } from '../fn/supports/supports-submit-supports';
import { SupportsSubmitSupports$Params } from '../fn/supports/supports-submit-supports';

@Injectable({ providedIn: 'root' })
export class SupportsService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `supportsCheckSelfServeEligibility()` */
  static readonly SupportsCheckSelfServeEligibilityPath = '/api/Evacuations/{evacuationFileId}/Supports/eligible';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `supportsCheckSelfServeEligibility()` instead.
   *
   * This method doesn't expect any request body.
   */
  supportsCheckSelfServeEligibility$Response(
    params: SupportsCheckSelfServeEligibility$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<EligibilityCheck>> {
    return supportsCheckSelfServeEligibility(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `supportsCheckSelfServeEligibility$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  supportsCheckSelfServeEligibility(
    params: SupportsCheckSelfServeEligibility$Params,
    context?: HttpContext
  ): Observable<EligibilityCheck> {
    return this.supportsCheckSelfServeEligibility$Response(params, context).pipe(
      map((r: StrictHttpResponse<EligibilityCheck>): EligibilityCheck => r.body)
    );
  }

  /** Path part for operation `supportsGetDraftSupports()` */
  static readonly SupportsGetDraftSupportsPath = '/api/Evacuations/{evacuationFileId}/Supports/draft';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `supportsGetDraftSupports()` instead.
   *
   * This method doesn't expect any request body.
   */
  supportsGetDraftSupports$Response(
    params: SupportsGetDraftSupports$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<DraftSupports>> {
    return supportsGetDraftSupports(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `supportsGetDraftSupports$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  supportsGetDraftSupports(params: SupportsGetDraftSupports$Params, context?: HttpContext): Observable<DraftSupports> {
    return this.supportsGetDraftSupports$Response(params, context).pipe(
      map((r: StrictHttpResponse<DraftSupports>): DraftSupports => r.body)
    );
  }

  /** Path part for operation `supportsCalculateAmounts()` */
  static readonly SupportsCalculateAmountsPath = '/api/Evacuations/{evacuationFileId}/Supports/draft';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `supportsCalculateAmounts()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  supportsCalculateAmounts$Response(
    params: SupportsCalculateAmounts$Params,
    context?: HttpContext
  ): Observable<
    StrictHttpResponse<
      Array<
        | SelfServeShelterAllowanceSupport
        | SelfServeFoodGroceriesSupport
        | SelfServeFoodRestaurantSupport
        | SelfServeIncidentalsSupport
        | SelfServeClothingSupport
      >
    >
  > {
    return supportsCalculateAmounts(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `supportsCalculateAmounts$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  supportsCalculateAmounts(
    params: SupportsCalculateAmounts$Params,
    context?: HttpContext
  ): Observable<
    Array<
      | SelfServeShelterAllowanceSupport
      | SelfServeFoodGroceriesSupport
      | SelfServeFoodRestaurantSupport
      | SelfServeIncidentalsSupport
      | SelfServeClothingSupport
    >
  > {
    return this.supportsCalculateAmounts$Response(params, context).pipe(
      map(
        (
          r: StrictHttpResponse<
            Array<
              | SelfServeShelterAllowanceSupport
              | SelfServeFoodGroceriesSupport
              | SelfServeFoodRestaurantSupport
              | SelfServeIncidentalsSupport
              | SelfServeClothingSupport
            >
          >
        ): Array<
          | SelfServeShelterAllowanceSupport
          | SelfServeFoodGroceriesSupport
          | SelfServeFoodRestaurantSupport
          | SelfServeIncidentalsSupport
          | SelfServeClothingSupport
        > => r.body
      )
    );
  }

  /** Path part for operation `supportsOptOut()` */
  static readonly SupportsOptOutPath = '/api/Evacuations/{evacuationFileId}/Supports/optout';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `supportsOptOut()` instead.
   *
   * This method doesn't expect any request body.
   */
  supportsOptOut$Response(params: SupportsOptOut$Params, context?: HttpContext): Observable<StrictHttpResponse<void>> {
    return supportsOptOut(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `supportsOptOut$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  supportsOptOut(params: SupportsOptOut$Params, context?: HttpContext): Observable<void> {
    return this.supportsOptOut$Response(params, context).pipe(map((r: StrictHttpResponse<void>): void => r.body));
  }

  /** Path part for operation `supportsSubmitSupports()` */
  static readonly SupportsSubmitSupportsPath = '/api/Evacuations/{evacuationFileId}/Supports';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `supportsSubmitSupports()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  supportsSubmitSupports$Response(
    params: SupportsSubmitSupports$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<void>> {
    return supportsSubmitSupports(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `supportsSubmitSupports$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  supportsSubmitSupports(params: SupportsSubmitSupports$Params, context?: HttpContext): Observable<void> {
    return this.supportsSubmitSupports$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }
}
