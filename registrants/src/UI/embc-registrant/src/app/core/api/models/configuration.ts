/* tslint:disable */
/* eslint-disable */
import { OidcOptions } from './oidc-options';
import { OutageInformation } from './outage-information';
export interface Configuration {
  oidc?: null | OidcOptions;
  outageInfo?: null | OutageInformation;
}
