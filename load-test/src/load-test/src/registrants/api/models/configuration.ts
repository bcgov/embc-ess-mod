/* tslint:disable */
/* eslint-disable */
import { OidcOptions } from './oidc-options';
import { OutageInformation } from './outage-information';
import { TimeoutConfiguration } from './timeout-configuration';
export interface Configuration {
  oidc?: null | OidcOptions;
  outageInfo?: null | OutageInformation;
  timeoutInfo?: null | TimeoutConfiguration;
}
