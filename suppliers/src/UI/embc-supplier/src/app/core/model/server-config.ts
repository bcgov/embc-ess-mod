import { CaptchaConfiguration, OidcConfiguration } from '../services/config.service';

export class ServerConfig {
  environment: string;
  maintMsg: string;
  noticeMsg: string;
  oidc: OidcConfiguration;
  captcha?: CaptchaConfiguration;
  siteDown: boolean;
}
