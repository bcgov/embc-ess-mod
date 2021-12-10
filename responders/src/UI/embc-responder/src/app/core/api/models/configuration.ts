/* tslint:disable */
/* eslint-disable */
import { OidcConfiguration } from './oidc-configuration';
import { OutageInformation } from './outage-information';
import { TimeoutConfiguration } from './timeout-configuration';
export interface Configuration {
  oidc?: null | OidcConfiguration;
  outageInfo?: null | OutageInformation;
  timeoutInfo?: null | TimeoutConfiguration;
}
