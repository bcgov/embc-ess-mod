/* tslint:disable */
/* eslint-disable */
import { CaptchaConfiguration } from '../models/captcha-configuration';
import { OidcOptions } from '../models/oidc-options';
import { OutageInformation } from '../models/outage-information';
import { TimeoutConfiguration } from '../models/timeout-configuration';
export interface Configuration {
  captcha?: CaptchaConfiguration;
  oidc?: OidcOptions;
  outageInfo?: OutageInformation;
  timeoutInfo?: TimeoutConfiguration;
}
