/* tslint:disable */
/* eslint-disable */
import { OidcOptions } from './oidc-options';
import { OutageInformation } from './outage-information';
import { TimeoutConfiguration } from './timeout-configuration';
export interface Configuration {
  oidc?: OidcOptions;
  outageInfo?: OutageInformation;
  timeoutInfo?: TimeoutConfiguration;
}
