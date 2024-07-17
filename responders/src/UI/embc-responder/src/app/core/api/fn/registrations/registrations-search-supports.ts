/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { ClothingSupport } from '../../models/clothing-support';
import { FoodGroceriesSupport } from '../../models/food-groceries-support';
import { FoodRestaurantSupport } from '../../models/food-restaurant-support';
import { IncidentalsSupport } from '../../models/incidentals-support';
import { LodgingAllowanceSupport } from '../../models/lodging-allowance-support';
import { LodgingBilletingSupport } from '../../models/lodging-billeting-support';
import { LodgingGroupSupport } from '../../models/lodging-group-support';
import { LodgingHotelSupport } from '../../models/lodging-hotel-support';
import { TransportationOtherSupport } from '../../models/transportation-other-support';
import { TransportationTaxiSupport } from '../../models/transportation-taxi-support';

export interface RegistrationsSearchSupports$Params {
  manualReferralId?: string;
  fileId?: string;
}

export function registrationsSearchSupports(
  http: HttpClient,
  rootUrl: string,
  params?: RegistrationsSearchSupports$Params,
  context?: HttpContext
): Observable<
  StrictHttpResponse<
    Array<
      | ClothingSupport
      | IncidentalsSupport
      | FoodGroceriesSupport
      | FoodRestaurantSupport
      | LodgingHotelSupport
      | LodgingBilletingSupport
      | LodgingGroupSupport
      | LodgingAllowanceSupport
      | TransportationTaxiSupport
      | TransportationOtherSupport
    >
  >
> {
  const rb = new RequestBuilder(rootUrl, registrationsSearchSupports.PATH, 'get');
  if (params) {
    rb.query('manualReferralId', params.manualReferralId, {});
    rb.query('fileId', params.fileId, {});
  }

  return http.request(rb.build({ responseType: 'json', accept: 'application/json', context })).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<
        Array<
          | ClothingSupport
          | IncidentalsSupport
          | FoodGroceriesSupport
          | FoodRestaurantSupport
          | LodgingHotelSupport
          | LodgingBilletingSupport
          | LodgingGroupSupport
          | LodgingAllowanceSupport
          | TransportationTaxiSupport
          | TransportationOtherSupport
        >
      >;
    })
  );
}

registrationsSearchSupports.PATH = '/api/Registrations/supports';
