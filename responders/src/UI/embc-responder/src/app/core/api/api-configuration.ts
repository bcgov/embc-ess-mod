/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';

/**
 * Global configuration
 */
@Injectable({
  providedIn: 'root'
})
export class ApiConfiguration {
  rootUrl: string = 'https://dev-era-responders.apps.silver.devops.gov.bc.ca';
}

/**
 * Parameters for `ApiModule.forRoot()`
 */
export interface ApiConfigurationParams {
  rootUrl?: string;
}
