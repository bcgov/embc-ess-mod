/* tslint:disable */
/* eslint-disable */
import { OidcConfiguration } from './oidc-configuration';
import { OutageInformation } from './outage-information';
import { TimeoutConfiguration } from './timeout-configuration';
export interface Configuration {
  oidc?: OidcConfiguration;
  outageInfo?: OutageInformation;
  timeoutInfo?: TimeoutConfiguration;
}
