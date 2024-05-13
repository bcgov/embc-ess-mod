/* tslint:disable */
/* eslint-disable */
import { OidcConfiguration } from '../models/oidc-configuration';
import { OutageInformation } from '../models/outage-information';
import { TimeoutConfiguration } from '../models/timeout-configuration';
export interface Configuration {
  oidc?: OidcConfiguration;
  outageInfo?: OutageInformation;
  timeoutInfo?: TimeoutConfiguration;
}
