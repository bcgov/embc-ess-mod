/* tslint:disable */
/* eslint-disable */
import { CaptchaConfiguration } from './captcha-configuration';
import { OidcOptions } from './oidc-options';
import { OutageInformation } from './outage-information';
import { TimeoutConfiguration } from './timeout-configuration';
export interface Configuration {
  captcha?: CaptchaConfiguration;
  oidc?: OidcOptions;
  outageInfo?: OutageInformation;
  timeoutInfo?: TimeoutConfiguration;
}
